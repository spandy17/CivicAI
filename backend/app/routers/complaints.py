from collections import Counter

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import get_current_user, require_admin
from ..database import get_db
from ..models import Complaint, User
from ..schemas import ComplaintCreate, ComplaintResponse
from ..services.ai_service import analyze_complaint
from ..services.similarity_service import (
    find_similar_complaint,
    generate_cluster_id
)


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


# =========================================================
# CREATE COMPLAINT
# =========================================================

@router.post(
    "/",
    response_model=ComplaintResponse
)
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    print("\n==============================")
    print("NEW COMPLAINT")
    print("==============================")

    print("Title:", complaint_data.title)
    print("Location:", complaint_data.location)
    print("Latitude:", complaint_data.latitude)
    print("Longitude:", complaint_data.longitude)

    # =====================================================
    # VALIDATE GPS
    # =====================================================

    latitude = complaint_data.latitude
    longitude = complaint_data.longitude

    if latitude is not None and longitude is not None:

        latitude = float(latitude)
        longitude = float(longitude)

        if latitude < -90 or latitude > 90:

            raise HTTPException(
                status_code=400,
                detail="Invalid latitude value."
            )

        if longitude < -180 or longitude > 180:

            raise HTTPException(
                status_code=400,
                detail="Invalid longitude value."
            )

    # =====================================================
    # AI ANALYSIS
    # =====================================================

    ai_result = analyze_complaint(
        title=complaint_data.title,
        description=complaint_data.description,
        location=complaint_data.location
    )

    # =====================================================
    # FIND SIMILAR COMPLAINTS
    # =====================================================

    existing_complaints = (
        db.query(Complaint)
        .all()
    )

    similar_complaint, similarity_score = (
        find_similar_complaint(
            complaint_data.title,
            complaint_data.description,
            existing_complaints
        )
    )

    # =====================================================
    # CLUSTER
    # =====================================================

    if similar_complaint:

        cluster_id = (
            similar_complaint.cluster_id
            or generate_cluster_id()
        )

        if not similar_complaint.cluster_id:

            similar_complaint.cluster_id = (
                cluster_id
            )

        complaint_cluster = cluster_id

    else:

        complaint_cluster = (
            generate_cluster_id()
        )

    # =====================================================
    # CREATE COMPLAINT
    # =====================================================

    new_complaint = Complaint(

        user_id=current_user.id,

        title=complaint_data.title,

        description=complaint_data.description,

        category=ai_result.get(
            "category",
            "General"
        ),

        subcategory=ai_result.get(
            "subcategory",
            "Other"
        ),

        priority=ai_result.get(
            "priority",
            "MEDIUM"
        ),

        priority_score=int(
            ai_result.get(
                "priority_score",
                50
            )
        ),

        # IMPORTANT GPS FIELDS
        location=complaint_data.location,

        latitude=latitude,

        longitude=longitude,

        department=ai_result.get(
            "department",
            "Municipal Corporation"
        ),

        status="SUBMITTED",

        ai_summary=ai_result.get(
            "ai_summary",
            complaint_data.description[:200]
        ),

        recommended_action=ai_result.get(
            "recommended_action",
            "Forward the complaint to the appropriate department for review."
        ),

        sentiment=ai_result.get(
            "sentiment",
            "NEUTRAL"
        ),

        cluster_id=complaint_cluster,

        similarity_score=similarity_score
    )

    # =====================================================
    # SAVE TO DATABASE
    # =====================================================

    db.add(new_complaint)

    db.commit()

    db.refresh(new_complaint)

    # =====================================================
    # VERIFY GPS AFTER DATABASE SAVE
    # =====================================================

    print("\nDATABASE SAVED")
    print("------------------------------")
    print("Complaint ID:", new_complaint.id)
    print("Location:", new_complaint.location)
    print("Latitude:", new_complaint.latitude)
    print("Longitude:", new_complaint.longitude)
    print("------------------------------\n")

    return new_complaint


# =========================================================
# GET ALL COMPLAINTS
# =========================================================

@router.get(
    "/",
    response_model=list[ComplaintResponse]
)
def get_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Complaint)

    # ADMIN → ALL COMPLAINTS
    #
    # CITIZEN → ONLY THEIR OWN COMPLAINTS

    if current_user.role != "admin":

        query = query.filter(
            Complaint.user_id == current_user.id
        )

    complaints = (
        query
        .order_by(
            Complaint.created_at.desc()
        )
        .all()
    )

    # =====================================================
    # DEBUG GPS DATA
    # =====================================================

    print("\nGET COMPLAINTS")
    print("------------------------------")

    for complaint in complaints:

        print(
            f"ID={complaint.id} | "
            f"Lat={complaint.latitude} | "
            f"Lng={complaint.longitude}"
        )

    print("------------------------------\n")

    return complaints


# =========================================================
# ADMIN STATISTICS
# IMPORTANT:
# KEEP THIS BEFORE /{complaint_id}
# =========================================================

@router.get(
    "/stats"
)
def get_complaint_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    complaints = (
        db.query(Complaint)
        .all()
    )

    total_complaints = len(
        complaints
    )

    pending_complaints = sum(
        1
        for complaint in complaints
        if complaint.status != "RESOLVED"
    )

    resolved_complaints = sum(
        1
        for complaint in complaints
        if complaint.status == "RESOLVED"
    )

    high_priority_complaints = sum(
        1
        for complaint in complaints
        if complaint.priority in [
            "HIGH",
            "CRITICAL"
        ]
    )

    categories = Counter(
        complaint.category
        for complaint in complaints
        if complaint.category
    )

    departments = Counter(
        complaint.department
        for complaint in complaints
        if complaint.department
    )

    priorities = Counter(
        complaint.priority
        for complaint in complaints
        if complaint.priority
    )

    statuses = Counter(
        complaint.status
        for complaint in complaints
        if complaint.status
    )

    clusters = Counter(
        complaint.cluster_id
        for complaint in complaints
        if complaint.cluster_id
    )

    duplicate_complaints = sum(
        1
        for complaint in complaints
        if (
            complaint.similarity_score is not None
            and complaint.similarity_score >= 0.45
        )
    )

    mapped_complaints = sum(
        1
        for complaint in complaints
        if (
            complaint.latitude is not None
            and complaint.longitude is not None
        )
    )

    return {

        "total_complaints":
            total_complaints,

        "pending_complaints":
            pending_complaints,

        "resolved_complaints":
            resolved_complaints,

        "high_priority_complaints":
            high_priority_complaints,

        "duplicate_complaints":
            duplicate_complaints,

        "mapped_complaints":
            mapped_complaints,

        "categories":
            dict(categories),

        "departments":
            dict(departments),

        "priorities":
            dict(priorities),

        "statuses":
            dict(statuses),

        "clusters":
            dict(clusters)
    }


# =========================================================
# GET SINGLE COMPLAINT
# =========================================================

@router.get(
    "/{complaint_id}",
    response_model=ComplaintResponse
)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.id == complaint_id
        )
        .first()
    )

    if complaint is None:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    # CITIZEN CAN ONLY VIEW THEIR OWN COMPLAINT

    if (
        current_user.role != "admin"
        and complaint.user_id != current_user.id
    ):

        raise HTTPException(
            status_code=403,
            detail="You can only access your own complaints"
        )

    print(
        f"GET COMPLAINT {complaint.id}: "
        f"latitude={complaint.latitude}, "
        f"longitude={complaint.longitude}"
    )

    return complaint


# =========================================================
# UPDATE COMPLAINT STATUS
# ADMIN ONLY
# =========================================================

@router.put(
    "/{complaint_id}/status"
)
def update_complaint_status(
    complaint_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):

    allowed_statuses = [
        "SUBMITTED",
        "IN_PROGRESS",
        "RESOLVED"
    ]

    status = status.upper()

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. "
                "Use SUBMITTED, IN_PROGRESS or RESOLVED."
            )
        )

    complaint = (
        db.query(Complaint)
        .filter(
            Complaint.id == complaint_id
        )
        .first()
    )

    if complaint is None:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    complaint.status = status

    db.commit()

    db.refresh(complaint)

    return {

        "message":
            "Complaint status updated",

        "complaint_id":
            complaint.id,

        "status":
            complaint.status
    }