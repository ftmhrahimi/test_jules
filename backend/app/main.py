from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
from app.core.database import engine
from app.models import models

app = FastAPI(title="PM Report Validator API")

# The most robust CORS setup for FastAPI:
# 1. allow_origin_regex allows any origin while still permitting credentials
# 2. allow_credentials=True is necessary for many frontend clients
# 3. Explicitly allow common headers used by Axios
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="http://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    try:
        models.Base.metadata.create_all(bind=engine)
        print("Database tables verified/created.")

        # Create default user for testing
        from app.core.database import SessionLocal
        from app.core.auth import get_password_hash
        db = SessionLocal()
        if not db.query(models.User).filter(models.User.username == "admin").first():
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
