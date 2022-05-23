import email
from datetime import datetime, date

from sqlalchemy import null
from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from hashlib import md5
import random
from flask import request




class Words(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(60), index=True, unique=True)
    definition = db.Column(db.String(60), index=True, unique=True)


    def __repr__(self):
        return '<Words {}>'.format(self.word)


class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(60), index=True, unique=True)
    username = db.Column(db.String(60), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    last_seen = db.Column(db.DateTime, default=datetime.utcnow())


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def avatar(self, size):
        digest = md5('hangguest@protonmail.com'.lower().encode('utf-8')).hexdigest()
        return 'https://www.gravatar.com/avatar/{}?d=retro&s={}'.format(digest,size)

class Scores(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    points = db.Column(db.Integer)
    recorded = db.Column(db.Date, index=True, default=date.today())
    difficulty = db.Column(db.String(10))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False)

    def __repr__(self):
        return '<Scores {}>'.format(self.number_of_guesses)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))