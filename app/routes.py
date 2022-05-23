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
from werkzeug.utils import secure_filename
from datetime import datetime, date
import random
import json
import os

user_date = (date.today().day + (date.today().month * 30)
             ) % len(Words.query.all())
answer = Words.query.get(user_date).word.upper()
wordID = Words.query.filter_by(word=str(answer).capitalize()).first_or_404().id
definition = Words.query.get(user_date).definition

#home page, main game
@app.route('/')
@app.route('/hangman', methods=['Get', 'Post'])
@login_required
def hangman():
    if len(Scores.query.filter_by(user_id=current_user.id, word_id=wordID).all()) != 0:
        return redirect(url_for('wotd'))
    return render_template('Hangman.html', title='Home', answer=answer, definition=definition)

#login page
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

#logout page
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('hangman'))

#registration page
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

#sets user to guest
@app.route('/guest', methods=['GET', 'POST'])
def guest():
    user = User.query.filter_by(username='guest').first()
    user.check_password('guest')
    login_user(user)
    next_page = request.args.get('next')
    if not next_page or url_parse(next_page).netloc != '':
        next_page = url_for('hangman')
    return redirect(next_page)

#profile page for users
@app.route('/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    theScore = []
    for score in Scores.query.filter_by(user_id=current_user.id).all():
        theScore.append([f"{Words.query.get(score.word_id).word}", 
                        f"{score.points}"])
    return render_template('user.html', user=user, points=theScore)

#last seen function
@app.before_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()

#edit profile page
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

#updates score db
@app.route('/processUserInfo/<string:userInfo>', methods=['POST'])
def processUserInfo(userInfo):
    userInfo = json.loads(userInfo)
    points = userInfo.get('points')
    s = Scores(points=points, user_id=current_user.id,
               word_id=wordID, difficulty=userInfo.get('difficulty'))
    if current_user.id != 1:
        db.session.add(s)
        db.session.commit()
    return str(current_user.id)

# renders the scoreboard html page
@app.route('/scoreboard', methods=['GET', 'POST'])
@login_required
def scoreboard():
    if len(Scores.query.filter_by(user_id=current_user.id, word_id=wordID).all()) == 0:
        return redirect(url_for('notAnswered'))
    player_scores = []
    for score in Scores.query.all():
        player_scores.append([User.query.get(score.user_id).username, score.points,
                              Words.query.get(
                                  score.word_id).word, score.difficulty,
                              score.recorded])
    return render_template('scoreboard.html', user_score=player_scores)

# renders word of the day html page and loads in the users score, definition, and their previous scores
@app.route('/wotd', methods=['GET'])
@login_required
def wotd():
    return render_template('wotd.html', word=answer.capitalize(),
                           score=Scores.query.filter_by(
                               user_id=current_user.id, word_id=wordID).first_or_404().points,
                           definition=definition)

#checks if puzzle has been completed before loading scoreboard
@app.route('/notAnswered', methods=['GET', 'POST'])
@login_required
def notAnswered():
    return render_template('notAnswered.html')
