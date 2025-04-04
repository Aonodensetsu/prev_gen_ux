import connexion

app = connexion.App(__name__, specification_dir='./spec/')
app.add_api('openapi.yaml', arguments={'title': 'Preview Generator API'}, pythonic_params=True)

