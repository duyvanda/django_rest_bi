from rest_framework import serializers
from .models import Product, Order, OrderItem, ShippingAddress, Review, User
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed

#https://www.django-rest-framework.org/api-guide/fields/#serializermethodfield


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=68, min_length=6, write_only=True)

    # default_error_messages = {
    #     'username': 'The username should only contain alphanumeric characters'}

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def validate(self, attrs):
        # https://stackoverflow.com/questions/31278418/django-rest-framework-custom-fields-validation
        email = attrs.get('email', '')
        username = attrs.get('username', '')

        if not username.isalnum():
            raise serializers.ValidationError(
                self.default_error_messages)
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    username = serializers.CharField(max_length=255, min_length=3, read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    is_Admin = serializers.SerializerMethodField(read_only=True)
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id','is_Admin', 'username','name','email','password', 'token']

    def get_token(self, obj):
        user = User.objects.get(email=obj['email'])

        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    def get_name(self, obj):
        user = User.objects.get(email=obj['email'])
        name = user.username
        if name == '':
            name = user.email
        return name

    def get__id(self, obj):
        user = User.objects.get(email=obj['email'])
        return user.id
    
    def get_is_Admin(self, obj):
        user = User.objects.get(email=obj['email'])
        return user.is_staff

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','is_staff', 'username','email']

class ProductSerializer(serializers.ModelSerializer):
    # reviews = ReviewSerializer(read_only=True, many=True)
    reviews = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        address = obj.shippingaddress
        serializer = ShippingAddressSerializer(address, many=False)
        return serializer.data


        # try:
        #     address = ShippingAddressSerializer(
        #         obj.shippingaddress, many=False).data
        # except:
        #     address = False
        # return address

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data