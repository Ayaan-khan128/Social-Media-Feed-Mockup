from fastapi import Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from database import engine, Base
import models

class PostCreate(BaseModel):
    username: str
    content: str

class CommentCreate(BaseModel):
    username: str
    content: str   

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Social Media Feed API is running!"}


@app.get("/api/db-health")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "success",
            "message": "MySQL database connected successfully!"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.post("/api/posts")
def create_post(post: PostCreate, db: Session = Depends(get_db)):

    if not post.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Post content cannot be empty."
        )

    new_post = models.Post(
        username=post.username,
        content=post.content
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {
        "message": "Post created successfully!",
        "post": {
            "id": new_post.id,
            "username": new_post.username,
            "content": new_post.content,
            "likes": new_post.likes
        }
    }


@app.get("/api/posts")
def get_posts(db: Session = Depends(get_db)):

    posts = db.query(models.Post).order_by(
        models.Post.created_at.desc()
    ).all()

    return posts

@app.post("/api/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):

    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found."
        )

    post.likes += 1

    db.commit()
    db.refresh(post)

    return {
        "message": "Post liked successfully!",
        "likes": post.likes
    }

@app.post("/api/posts/{post_id}/comments")
def add_comment(
    post_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db)
):

    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found."
        )

    if not comment.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Comment cannot be empty."
        )

    new_comment = models.Comment(
        post_id=post_id,
        username=comment.username,
        content=comment.content
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return {
        "message": "Comment added successfully!",
        "comment": {
            "id": new_comment.id,
            "post_id": new_comment.post_id,
            "username": new_comment.username,
            "content": new_comment.content
        }
    }

@app.get("/api/posts/{post_id}/comments")
def get_comments(post_id: int, db: Session = Depends(get_db)):

    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found."
        )

    comments = db.query(models.Comment).filter(
        models.Comment.post_id == post_id
    ).order_by(
        models.Comment.created_at.asc()
    ).all()

    return comments

@app.delete("/api/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):

    post = db.query(models.Post).filter(
        models.Post.id == post_id
    ).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found."
        )

    db.delete(post)
    db.commit()

    return {
        "message": "Post deleted successfully!"
    }