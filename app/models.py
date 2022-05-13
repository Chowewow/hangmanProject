import email
from datetime import datetime
from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from hashlib import md5

# scores = db.table('scores',
#     db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
#     db.Column('word_id', db.Integer, db.ForeignKey('words.id')))
#      db.Column('score', db.Integer),
#      db.Column('recorded', db.Date, index=True, default=datetime.utcnow)
    


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
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    # score = db.relationship(
    #     'User', secondary=scores,
    #     primaryjoin=(scores.c.user_id == id),
    #     secondaryjoin=(scores.c.word_id == Words.id),
    #     backref=db.backref('Scores', lazy='dynamic'), lazy='dynamic')

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
    number_of_guesses = db.Column(db.Integer)
    recorded = db.Column(db.Date, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False)
    

    def __repr__(self):
        return '<Scores {}>'.format(self.number_of_guesses)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))