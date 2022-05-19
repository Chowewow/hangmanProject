from crypt import methods
import json
import re
from turtle import title
from unittest import result
from flask import Flask, render_template, flash, redirect, url_for, request
from app import app, db
from app.models import Scores, User, Words
from app.forms import RegistrationForm, LoginForm, EditProfileForm
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse
from datetime import datetime, date
import random
import json

user_date = (date.today().day + (date.today().month * 30)
             ) % len(Words.query.all())
answer = Words.query.get(user_date).word.upper()
wordID = Words.query.filter_by(word=str(answer).capitalize()).first_or_404().id
definition = Words.query.get(user_date).definition


@app.route('/')
@app.route('/hangman', methods=['Get', 'Post'])
@login_required
def hangman():
    if len(Scores.query.filter_by(user_id=current_user.id, word_id=wordID).all()) != 0:
        return redirect(url_for('wotd'))
    return render_template('Hangman.html', title='Home', answer=answer, definition=definition)


# @loginrequired
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('hangman'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('hangman')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('hangman'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('hangman'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route('/guest', methods=['GET', 'POST'])
def guest():
    user = User.query.filter_by(username='guest').first()
    user.check_password('guest')
    login_user(user)
    next_page = request.args.get('next')
    if not next_page or url_parse(next_page).netloc != '':
        next_page = url_for('hangman')
    return redirect(next_page)


@app.route('/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    return render_template('user.html', user=user)


@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()


@app.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm(current_user.username)
    if form.validate_on_submit():
        current_user.username = form.username.data
        db.session.commit()
        flash('Your changes have been saved.')
        return redirect(url_for('edit_profile'))
    elif request.method == 'GET':
        form.username.data = current_user.username
    return render_template('edit_profile.html', title='Edit Profile', form=form)


@app.route('/processUserInfo/<string:userInfo>', methods=['POST'])
def processUserInfo(userInfo):
    userInfo = json.loads(userInfo)
    score = userInfo.get('guesses') + userInfo.get('mistakes')
    s = Scores(number_of_guesses=score,
               user_id=current_user.id, word_id=wordID)
    if current_user.id != 1:
        db.session.add(s)
        db.session.commit()
    return str(current_user.id)


@app.route('/leaderboard', methods=['GET', 'POST'])
def leaderboard():
    return render_template('leaderboard.html')


@app.route('/wotd', methods=['GET'])
@login_required
def wotd():
    dict = {}
    for score in Scores.query.filter_by(user_id=current_user.id).all():
        dict[f"{Words.query.get(score.word_id).word}"] = f"{score.number_of_guesses}"

    return render_template('wotd.html', word=answer.capitalize(),
                           score=Scores.query.filter_by(
                               user_id=current_user.id, word_id=wordID).first_or_404().number_of_guesses,
                           definition=definition, dict=dict)
