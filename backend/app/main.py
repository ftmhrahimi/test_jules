from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from app.api.endpoints import router
from app.core.database import engine
from app.models import models

app = FastAPI(title="PM Report Validator API")

@app.on_event("startup")
def on_startup():
    try:
        models.Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database connection error: {e}")

# Custom aggressive CORS middleware for difficult environments
@app.middleware("http")
async def custom_cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response(status_code=204)
    else:
        response = await call_next(request)

    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    else:
        response.headers["Access-Control-Allow-Origin"] = "*"

    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept"

    return response

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "PM Report Validator API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
