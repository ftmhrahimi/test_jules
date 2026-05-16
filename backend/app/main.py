from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
from app.core.database import engine
from app.models import models

app = FastAPI(title="PM Report Validator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://10.224.235.31:3001",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    try:
        models.Base.metadata.create_all(bind=engine)
        print("Database tables verified/created.")

        from app.core.database import SessionLocal
        from app.core.auth import get_password_hash

        db = SessionLocal()

        if not db.query(models.User).filter(
            models.User.username == "admin"
        ).first():

            admin_user = models.User(
                username="admin",
                hashed_password=get_password_hash("admin@1234")
            )

            db.add(admin_user)
            db.commit()

            print("Default user 'admin' created.")

        db.close()

    except Exception as e:
        print(f"Database connection error: {e}")

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "PM Report Validator API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
