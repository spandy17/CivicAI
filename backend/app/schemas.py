from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class ComplaintCreate(BaseModel):
    title: str
    description: str
    location: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str

    category: str | None
    subcategory: str | None

    priority: str
    priority_score: int

    location: str | None

    # IMPORTANT
    latitude: float | None
    longitude: float | None

    department: str | None
    status: str

    ai_summary: str | None
    recommended_action: str | None
    sentiment: str | None

    cluster_id: str | None
    similarity_score: float | None

    class Config:
        from_attributes = True