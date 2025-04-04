from json import dumps
from io import BytesIO

from prev_gen import Config, Previewer, Reverser
from PIL import Image, UnidentifiedImageError
from PIL.PngImagePlugin import PngInfo
from flask import send_file


def POST_save(body=None) -> BytesIO:
    """
    Generate a PNG from GUI

    :param body:
    :type body: json dict

    :rtype: image/png BytesIO
    """
    try:
        palette = Config.read(dumps(body), output='json').palette
    except ValueError as e:
        return 'Could not parse configuration', 400
    img = Previewer(palette, show=False)
    # for some reason pillow does not include metadata by default
    # write it into PngInfo before sending the file
    meta = PngInfo()
    for k, v in img.text.items():
        meta.add_text(k, v)
    buf = BytesIO()
    img.save(buf, format='PNG', pnginfo=meta)
    buf.seek(0)
    return buf, 200, {'Content-Type': 'image/png'}


def POST_load(body=None) -> str:
    """
    Load a PNG into GUI

    :param body:
    :type body: image/png blob

    :rtype: str

    """
    try:
       img = Image.open(BytesIO(body))
    except TypeError:
        return 'No image sent', 400
    except UnidentifiedImageError:
        return 'Not an image', 400
    img2 = img.convert('RGBA')
    # for some reason pillow doesn't keep metadata by default
    # insert it back after converting
    try:
        img2.text = img.text
    except AttributeError:
        return 'Image does not have metadata', 400
    # TODO: find try/catch cases here
    palette = Reverser(img2)
    json = {}
    sett = palette[0].to_dict()
    if sett:
        json.update({'settings': sett})
    pall = list(map(lambda r: list(map(lambda c: c.to_dict() if c.alpha > 0.005 else {}, r)), palette[1:]))
    if pall:
        json.update({'palette': pall})
    return json, 200

