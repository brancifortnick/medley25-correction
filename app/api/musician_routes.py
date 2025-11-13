from flask import Blueprint, request, jsonify
from app.forms.musician_form import MusicianForm
from flask_login import current_user, login_required
from app.models import Musician, Song, db
from app.s3_helpers import (
    get_unique_filename, allowed_file, upload_file_to_s3)
from sqlalchemy.orm import joinedload


musician_routes = Blueprint('musicians', __name__)


@musician_routes.route('/', methods=['GET'])
@login_required
def get_musicians():
    musicians = Musician.query.options(joinedload(Musician.songs)).all()
    return {'musicians': [musician.to_dict() for musician in musicians]}


@musician_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_artist_id(id):
    musician = Musician.query.options(joinedload(Musician.songs)).get(id)
    if not musician:
        return {"errors": "Musician not found"}, 404
    return musician.to_dict()


@musician_routes.route('/<int:id>/songs')
@login_required
def musicians_songs(id):
    musician = Musician.query.get(id)
    if not musician:
        return {"errors": "Musician not found"}, 404
    
    # Get all songs for this musician
    songs = Song.query.filter(Song.musician_id == id).all()
    
    # Filter out private songs if the current user is not the owner
    if current_user.id != musician.user_id:
        songs = [song for song in songs if not song.is_private]
    
    return {'songs': [song.to_dict() for song in songs]}


@musician_routes.route('/new-picture', methods=['POST'])
@login_required
def upload_picture():
    try:
        # Check if file is in request
        if 'profile_img' not in request.files:
            return {"errors": "No file provided"}, 400

        profile_img = request.files['profile_img']

        # Check if file was actually selected
        if profile_img.filename == '':
            return {"errors": "No file selected"}, 400

        # Check if file type is allowed
        if not allowed_file(profile_img.filename):
            return {"errors": "File type not allowed"}, 400

        profile_img.filename = get_unique_filename(profile_img.filename)

        upload = upload_file_to_s3(profile_img)

        if "url" not in upload:
            return upload, 400

        url = upload['url']

        return {'url': url}

    except Exception as e:
        print(f"Error in upload_picture: {str(e)}")
        return {"errors": f"Upload failed: {str(e)}"}, 500


@musician_routes.route('/new', methods=['POST'])
@login_required
def create_musician():
    try:
        # Check required fields
        if not request.form.get('musician_name'):
            return {"errors": "Musician name is required"}, 400
        if not request.form.get('biography'):
            return {"errors": "Biography is required"}, 400
        if not request.form.get('profile_img'):
            return {"errors": "Profile image URL is required"}, 400

        new_musician = Musician(
            musician_name=request.form['musician_name'],
            biography=request.form['biography'],
            profile_img=request.form['profile_img'],
            user_id=current_user.id
        )

        print('=================Creating musician:',
              new_musician.to_dict(), '===================')

        db.session.add(new_musician)
        db.session.commit()
        return new_musician.to_dict()

    except Exception as e:
        print(f"Error creating musician: {str(e)}")
        db.session.rollback()
        return {"errors": f"Failed to create musician: {str(e)}"}, 500


@musician_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_musician(id):
    musician = Musician.query.get(id)

    if not musician:
        return jsonify('Musician does not exist')

    db.session.delete(musician)
    db.session.commit()
    return {'id': id }


@musician_routes.route("/<int:id>/biography", methods=["PUT"])
@login_required
def update_bio(id):
    musician = Musician.query.get(id)
    musician.biography = request.form["biography"]
    db.session.add(musician)
    db.session.commit()
    return musician.to_dict()

# @musician_routes.route('/<int:id>/image', methods=['PUT'])
# @login_required
# def upload_image_test(id):

#     if 'profile_img' not in request.files:
#         return {"errors": "image required"}, 400

#     profile_img = request.files["profile_img"]

#     # if not allowed_file(profile_img.filename):
#     #     return {"errors": "file type not permitted"}, 400

#     profile_img.filename = get_unique_filename(profile_img.filename)

#     upload = upload_file_to_s3(profile_img)

#     if "url" not in upload:
#         return upload, 400

#     url = upload['url']

#     musician = Musician.query.get(id)
#     musician.profile_img = url
#     db.session.add(musician)
#     db.session.commit()
#     return musician.to_dict()






#old routes

# @musician_routes.route('/new', methods=['POST'])
# @login_required
# def add_musician():

#     if request.method == 'POST':

#         form = MusicianForm()

#         form['csrf_token'].data = request.cookies['csrf_token']
#         if form.validate_on_submit():

#             musician = Musician(
#                 musician_name=form.data['musician_name'],
#                 profile_img=form.data['profile_img'],
#                 biography=form.data['biography'],
#                 user_id=current_user.id,
#             )
#             db.session.add(musician)
#             db.session.commit()
#             return musician.to_dict()



# @musician_routes.route('/new', methods=['POST'])
# @login_required
# def create_musician():

#     if 'profile_img' not in request.files:
#         return{'errors': 'image needed'}, 400

#     profile_img = request.files['profile_img']

#     if not allowed_file(profile_img.filename):
#         return {'errors': 'incorrect upload file type'}, 400

#     profile_img.filename = get_unique_filename(profile_img.filename)

#     upload = upload_file_to_s3(profile_img)

#     if 'url' not in upload:
#         return upload, 400

#     print('erroring url not found')

#     url = upload['url']

#     musician = Musician(
#         musician_name=request.form['musician_name'],
#         biography=request.form['biography'],
#         profile_img=url,
#         user_id=current_user.id,
#     )

#     db.session.add(musician)
#     db.session.commit()
#     print('uploading successfully')
#     return musician.to_dict()
