from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String, index=True)
    site_id = Column(String)
    category = Column(String)
    subcategory = Column(String)
    report_date = Column(String)
    fme_name = Column(String)
    overall_confirmation = Column(Float)
    summary = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User")
    items = relationship("ReportItem", back_populates="report")

class ReportItem(Base):
    __tablename__ = "report_items"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    item_num = Column(Integer)
    description = Column(String)
    reported_result = Column(String) # OK, NOT_OK
    ai_verdict = Column(String) # CONFIRMED, DISPUTED, NO_EVIDENCE
    ai_explanation = Column(String)
    causes = Column(JSON) # List of strings
    photo_count = Column(Integer, default=0)

    report = relationship("Report", back_populates="items")
    photos = relationship("PhotoMetadata", back_populates="item")

class PhotoMetadata(Base):
    __tablename__ = "photo_metadata"
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("report_items.id"))
    name = Column(String)
    url = Column(String)
    date = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    date_ok = Column(Boolean)
    gps_ok = Column(Boolean)

    item = relationship("ReportItem", back_populates="photos")
