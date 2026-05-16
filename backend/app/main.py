from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
from app.core.database import engine
from app.models import models

app = FastAPI(title="PM Report Validator API")

# Permissive CORS for production/offline environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    try:
        models.Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database connection error: {e}")

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "PM Report Validator API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
