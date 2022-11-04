import jwt
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status

def get(self, request):
    token = request.GET.get('token')
    print("this is token", token)
    payload = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=['HS256'])
    print("PRINT PAYLOAD", payload)
    # try:
        # payload = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=['HS256'])
    #     user = User.objects.get(id=payload['user_id'])
    #     if not user.is_verified:
    #         user.is_verified = True
    #         user.save()
    #     return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
    # except jwt.ExpiredSignatureError as identifier:
    #     return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
    # except jwt.exceptions.DecodeError as identifier:
    #     return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)