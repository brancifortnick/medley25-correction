from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User, Musician, db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/<int:id>/add-musician', methods=['POST'])
@login_required
def add_musician(id):
    try:
        user = User.query.get(id)

        if not user:
            return {"errors": "User not found"}, 404

        # Check if user already has a musician profile
        existing_musician = Musician.query.filter_by(user_id=id).first()
        if existing_musician:
            return {"errors": "User already has a musician profile"}, 400

        # Create new musician with default values
        musician = Musician(
            musician_name=user.username,
            profile_img=None,
            biography="",
            user_id=id
        )

        db.session.add(musician)
        db.session.commit()

        return {
            "message": "Musician profile created successfully",
            "musician": musician.to_dict(),
            "user": user.to_dict()
        }

    except Exception as e:
        print(f"Error creating musician profile: {str(e)}")
        db.session.rollback()
        return {"errors": f"Failed to create musician profile: {str(e)}"}, 500


@user_routes.route('/<int:id>/musician')
@login_required
def user_musician(id):
    """Get the musician profile for a user"""
    try:
        user = User.query.get(id)
        if not user:
            return {"errors": "User not found"}, 404

        musician = Musician.query.filter_by(user_id=id).first()

        if not musician:
            return {"musician": None}, 200

        return {"musician": musician.to_dict()}, 200

    except Exception as e:
        print(f"Error getting user musician: {str(e)}")
        return {"errors": f"Failed to get musician profile: {str(e)}"}, 500
