import os
from urllib.parse import urlencode

from social_core.backends.oauth import BaseOAuth2

from piranha import settings


class GroundTruthOAuth2(BaseOAuth2):
    """HackGT Ground Truth OAuth2 authentication backend"""
    name = 'ground_truth'
    url = os.getenv("GROUND_TRUTH_URL")
    AUTHORIZATION_URL = "{}/oauth/authorize".format(url)
    ACCESS_TOKEN_URL = "{}/oauth/token".format(url)
    ACCESS_TOKEN_METHOD = "POST"
    SCOPE_SEPARATOR = ','

    EXTRA_DATA = []
    ID_KEY = "uuid"

    def get_key_and_secret(self):
        return settings.SOCIAL_AUTH_GROUND_TRUTH_CLIENT_ID, settings.SOCIAL_AUTH_GROUND_TRUTH_CLIENT_SECRET

    def get_user_details(self, response):
        """Return user details from Ground Truth account"""
        email = response.get('email')
        name_parts = response.get('nameParts')
        first_name = name_parts.get("first")
        preferred_name = name_parts.get("preferred", first_name) or first_name
        last_name = name_parts.get("last")
        return {
            'email': email,
            'first_name': first_name,
            'preferred_name': preferred_name,
            'last_name': last_name,
        }

    def user_data(self, access_token, *args, **kwargs):
        """Loads user data from service"""
        user_data_url = "{}/api/user?{}".format(self.url, urlencode({
            'access_token': access_token
        }))
        return self.get_json(user_data_url)
