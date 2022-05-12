from app import app, db
from app.models import User, Words, Scores

@app.shell_context_processor
def make_shell_context():
    return {'db':db, 'User': User, 'Words': Words, 'Scores': Scores}