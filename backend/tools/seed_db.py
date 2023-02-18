import os
import random
import sys

from app import create_app
from app.models.course import Course, CourseType
from app.models.user import User


def add_courses():
    print("Seeding courses...")
    courses = [
        Course(
            name="Fundamental Engineering Math 1",
            department="SYDE",
            code="111",
            description="Functions: trigonometric, exponential, log, inverse functions. Differential calculus: limits, continuity, derivatives, differentials, applications. Sequences and series: convergence, power series, Taylor expansions. Simple numerical methods. [Offered: F]",
            ceab_math=42.0,
            course_type=CourseType.REQUIRED,
        ),
        Course(
            name="Fundamental Engineering Math 2",
            department="SYDE",
            code="112",
            description="Integration: Indefinite and definite integral; techniques of integration; improper integrals, numerical methods, applications. Vector differential calculus: Partial, total, and directional derivative; Gradient divergence and curl; Jacobian. Applications. [Offered: W, S]",
            ceab_math=42.0,
            course_type=CourseType.REQUIRED,
        ),
        Course(
            name="Numerical and Applied Calculus",
            department="SYDE",
            code="114",
            description="Matrices and linear systems: determinants, eigenvalues and eigenvectors, LU decomposition, conditioning, numerical methods. First order ordinary differential equations: analytical techniques, applications, elementary numerical methods, convergence. [Offered: W, S]",
            ceab_math=36.0,
            course_type=CourseType.REQUIRED,
        ),
        Course(
            name="Digital Computation",
            department="SYDE",
            code="121",
            description="Computer systems, problem solving, data and programs, structured programming, arrays, matrices and pointers, correct and efficient algorithms, data structures. [Offered: F]",
            ceab_eng=27.0,
            ceab_design=27.0,
            course_type=CourseType.REQUIRED,
        ),
        Course(
            name="Engineering Design",
            department="SYDE",
            code="361",
            description="The methodology of design, situation of concern; needs analysis and problem definition, engineering analysis and generation of alternative solutions, design prototyping, and design documentation. The lecture material is supplemented by a term-long design project done in small groups that develops hands-on experience with electromechanical prototyping. [Offered: S]",
            ceab_eng=14.3,
            ceab_design=42.8,
            course_type=CourseType.REQUIRED,
        ),
        Course(
            name="Thermodynamics",
            department="SYDE",
            code="381",
            description="An introductory course in engineering thermodynamics structured for students in Systems Design. Classical thermodynamics is presented as the systematic study of energy; its use, degradation, and waste. Introduction to heat transfer by conduction, convection, and radiation. Applications focus on problems of energy and environment. The concepts of statistical thermodynamics are introduced. [Offered: S]",
            ceab_sci=18.9,
            ceab_eng=23.1,
            course_type=CourseType.REQUIRED,
        ),
        Course(
            name="Algorithm Design and Analysis",
            department="ECE",
            code="406",
            description="Design and analysis of efficient, correct algorithms. Advanced data structures, divide-and-conquer algorithms, recurrences, greedy algorithms, dynamic programming, graph algorithms, search and backtrack, inherently hard and unsolvable problems, approximation and randomized algorithms, and amortized analysis. [Offered: W]",
            ceab_eng=34.17,
            ceab_design=16.83,
            course_type=CourseType.TE,
        ),
        Course(
            name="Advanced Topics in Networking",
            department="ECE",
            code="416",
            description="This course introduces advanced topics in networking with a focus on applications and wireless technologies. Topics include: Cellular networks (2G, 3G, 4G and beyond), applications (Domain Name System [DNS], Simple Mail Transfer Protocol[SMTP], Post Office Protocol [POP], Internet Message Access Protocol [ IMAP], Hypertext Transfer Protocol [HTTP]) and socket programming, Content-centric networks (content delivery networks, peer-to-peer protocols, data centers, etc.), protocols for multimedia applications (Session Initiation Protocol [SIP], Real-time Transport Protocol [RTP], RTP Control Protocol [RTCP]), emerging technologies (Internet of Things, sensors, software defined networks), policy issues (network neutrality, who controls the Internet?). [Offered W]",
            ceab_math=12.75,
            ceab_eng=15.3,
            ceab_design=22.95,
            course_type=CourseType.TE,
        ),
        Course(
            name="Introduction to Machine Learning",
            department="MSCI",
            code="446",
            description="This course covers algorithmic and statistical foundations of data mining: extracting previously unknown and useful information from data. Topics include exploratory data analysis, data cleaning, data transformations, association rule mining, and both supervised and unsupervised learning. Methods typically covered include, but are not limited to: the Apriori algorithm, Bayesian inference, decision trees, linear and logistic regression, nearest-neighbor classification, and k-means clustering. [Offered: W]",
            ceab_eng=25.2,
            ceab_design=16.8,
            course_type=CourseType.TE,
        ),
        Course(
            name="First-Year Japanese 1",
            department="JAPAN",
            code="101R",
            description="An introductory course for students who have little or no knowledge of Japanese to develop basic listening, speaking, reading, and writing skills. Practical oral and written exercises incorporating the Hiragana Writing System provide a firm grammatical foundation for further study.",
            cse_weight=36.0,
            course_type=CourseType.LIST_D,
        ),
        Course(
            name="First-Year Japanese 2",
            department="JAPAN",
            code="102R",
            description="Listening, speaking, reading, and writing skills acquired in JAPAN 101R are further developed. Practical oral and written exercises incorporating the Katakana Writing System are used to develop a more solid grammatical base.",
            cse_weight=36.0,
            course_type=CourseType.LIST_D,
        ),
        Course(
            name="Popular Music and Culture",
            department="MUSIC",
            code="140",
            description="An examination of the styles, forms, and development of 20th century popular music. The social, commercial, and technological aspects of popular music are considered.",
            cse_weight=36.0,
            course_type=CourseType.LIST_C,
        ),
    ]
    for course in courses:
        course.save()
        # print(course.to_serializable_dict())


def get_random_course_ids(courses, num_courses=3):
    course_oids = set()
    for _ in range(num_courses):
        r_idx = random.randrange(0, len(courses))
        course_oids.add(courses[r_idx].to_serializable_dict()["id"])

    return list(course_oids)


def add_users():
    print("Seeding users...")
    courses = Course.objects.all()
    users = [
        User(
            name="Koshi Sugawara",
            email="breadfydp+cloud@gmail.com",
            grad_year="2023",
            program="SYDE",
            auth_id=os.getenv("TEST_USER_CLOUD_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 1),
        ),
        User(
            name="Hisashi Kinoshita",
            email="breadfydp+hokkaidomilk@gmail.com ",
            grad_year="2023",
            program="BME",
            auth_id=os.getenv("TEST_USER_HOKKAIDO_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 3),
        ),
        User(
            name="Tobio Kageyama",
            email="breadfydp+melon@gmail.com ",
            grad_year="2025",
            program="SYDE",
            auth_id=os.getenv("TEST_USER_MELON_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 7),
        ),
        User(
            name="Tadashi Yamaguchi",
            email="breadfydp+egg@gmail.com ",
            grad_year="2025",
            program="SYDE",
            auth_id=os.getenv("TEST_USER_EGG_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 4),
        ),
        User(
            name="Hitoka Yachi",
            email="breadfydp+brioche@gmail.com ",
            grad_year="2027",
            program="BME",
            auth_id=os.getenv("TEST_USER_BRIOCHE_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 2),
        ),
    ]
    for user in users:
        user.save()


def clear_database():
    print("Clearing database...")
    User.objects().delete()
    Course.objects().delete()
    print("Database cleared 🗑")


def seed_database():
    print("Seeding database...")
    add_courses()
    add_users()
    print("Database seeded 🌱")


if __name__ == "__main__":
    app = create_app("development")
    if "clear" in sys.argv:
        clear_database()
    else:
        seed_database()
