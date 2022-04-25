from django.urls import path

from .controllers.strategy_controller import RandomStrategy
from .views import UserView
from .views import CreateUserView

urlpatterns = [
    path('get_user', UserView.as_view()),
    path('create_user', CreateUserView.as_view()),
    path('random', RandomStrategy.as_view())

]
