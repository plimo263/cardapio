from flask.views import MethodView
from flask_smorest import abort, Blueprint
from models import RedeSocial
from schemas.rede_social_schema import RedeSocialSchema

blp = Blueprint('rede_social', __name__, description = 'Interatividade com os links das redes sociais')


@blp.route('/rede_social')
class RedeSocialRoute(MethodView):

    @blp.response(200, RedeSocialSchema(many=True))
    def get(self):
        ''' Retorna informações sobre as redes sociais ativas que vão aparece no rodapé do projeto.'''

        return RedeSocial.query.all()