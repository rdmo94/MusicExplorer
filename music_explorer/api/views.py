from os import stat
from xmlrpc.client import ResponseError
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from .serializers import UserSerializer, CreateUserSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here
class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
 
class CreateUserView(APIView):

    serializer_class = CreateUserSerializer

    def post(self, request, format=None):
        #if no session, create session
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data['email']
            queryset = User.objects.filter(email=email)
            if not queryset.exists():
                user = User(email=email)
                user.save()
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_409_CONFLICT)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

