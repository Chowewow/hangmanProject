import email
from datetime import datetime
from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(60), index=True, unique=True)
    username = db.Column(db.String(60), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'

class Scores(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    number_of_guesses = db.Column(db.Integer)
    recorded = db.Column(db.Date, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'))

    def __repr__(self):
        return '<Scores {}>'.format(self.number_of_guesses)

class Words(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(60), index=True, unique=True)
    definition = db.Column(db.String(60), index=True, unique=True)

    def __repr__(self):
        return '<Words {}>'.format(self.word)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))