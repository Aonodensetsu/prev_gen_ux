import connexion

app = connexion.AsyncApp(__name__, specification_dir='./spec/')
app.add_api('openapi.yaml', arguments={'title': 'Preview Generator API'}, pythonic_params=True)
application = app

