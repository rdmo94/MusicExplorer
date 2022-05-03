import json
import logging
from requests import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..util import load_similarity_matrix

logging.getLogger('requests').setLevel(logging.WARNING)

class GetSimilarityMatrixView(APIView):
    def get(self, request):
        similarity_matrix = load_similarity_matrix()
        return Response(data=json.dump(similarity_matrix),status=status.HTTP_200_OK)