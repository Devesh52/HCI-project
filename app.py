from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'
db = SQLAlchemy(app)

# User model for storing login credentials
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# User progress model (tracks user-specific progress)
class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    progress = db.Column(db.Integer, default=0)  # Example: progress tracking

# Initialize the database
with app.app_context():
    db.create_all()

@app.route("/")
def index():
    return render_template('index_firstpage.html')

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Fetch form data
        name = request.form.get('name')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # Check if all fields are present
        if not name or not password or not confirm_password:
            return render_template('register.html', error="All fields are required.")

        # Check if passwords match
        if password != confirm_password:
            return render_template('register.html', error="Passwords do not match.")

        # Check if user already exists
        existing_user = User.query.filter_by(name=name).first()
        if existing_user:
            return render_template('register.html', error="Username already taken.")

        # Create new user and progress entry
        new_user = User(name=name, password=password)
        db.session.add(new_user)
        db.session.commit()

        new_progress = UserProgress(user_id=new_user.id)
        db.session.add(new_progress)
        db.session.commit()

        return redirect(url_for('login'))

    return render_template('register.html')

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form.get('name')
        password = request.form.get('password')

        user = User.query.filter_by(name=name, password=password).first()
        if user:
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error="Invalid username or password.")

    return render_template('login.html')

@app.route('/page2')
def page2():
    return render_template('page2.html')

@app.route('/learn')
def learn():
    return render_template('Web1.html')

@app.route('/game1')
def game1():
    return render_template('game1.html')

@app.route("/learnability")
def learnability():
    alphabet_attempts = [
        ('ह', 10), ('स', 10), ('ष', 10), ('श', 10),
        ('व', 9), ('ल', 9), ('भ', 9), ('ब', 9),
        ('फ', 9), ('च', 5), ('ङ', 5), ('घ', 5), 
        ('ख', 4), ('क', 4), ('अः', 3), ('अं', 3),
        ('औ', 3), ('ओ', 3), ('ऐ', 3), ('ए', 2),
        ('ऊ', 2), ('ई', 2), ('इ', 1), ('आ', 1),
        ('अ', 1), ('उ', 1)
    ]
    return render_template('learnability.html', alphabet_attempts=alphabet_attempts)


if __name__ == "__main__":
    app.run(debug=True)
