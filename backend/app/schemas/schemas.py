from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class PhotoMetadata(BaseModel):
    name: str
    url: str
    date: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    date_ok: Optional[bool] = None
    gps_ok: Optional[bool] = None
    class Config:
        from_attributes = True

class ReportItem(BaseModel):
    id: int
    item_num: int
    description: str
    reported_result: str
    ai_verdict: str
    ai_explanation: str
    causes: List[str]
    photo_count: int
    photos: List[PhotoMetadata]
    class Config:
        from_attributes = True

class Report(BaseModel):
    id: int
    task_id: str
    site_id: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    report_date: Optional[str] = None
    fme_name: Optional[str] = None
    overall_confirmation: float
    summary: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class ReportDetail(Report):
    items: List[ReportItem]
