import os
import time 
from hashlib import sha1
from flask import Flask
from PIL import Image, ExifTags


class Imagens:

    @staticmethod
    def resize_image(filepath: str, size: tuple, new_file_path: str = None):
        ''' Redimensiona a imagem para o tamanho passado pelo argumento size'''
        Imagens.rotate_image(filepath, size, new_file_path)

    @staticmethod
    def rotate_image(filepath: str, size: tuple = None, novo_nome: str = None) -> bool:
        """Coloca a imagem na orientação correta. Fotos retiradas de câmeras 
        de celular quando salvas diretamente podem ficar com a orientação incorreta, 
        para resolver isto este método foi criado. Ele recebe o caminho até a imagem, 
        o tamanho (size) que se informado deve ser uma tupla e o novo_nome que nada 
        mais é que o caminho para salvar a nova imagem, 
        isto faz com que o arquivo original não seja sobreescrito.

        Parameters:
            filepath: Local no sistema de arquivos onde a imagem original esta
            size: Uma tupla que determina a larguraxaltura que a nova imagem será salva
            novo_nome: Determina um novo caminho para salvar a imagem tratada e acertada.
        
        Examples:
            >>> Imagens.rotate_image('/dados/backup/foto.png', (64,64), '/dados/backup/thumbnail/foto.png')
            True
        """
        try:
            image = Image.open(filepath)
            exf = None
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == "Orientation":
                    exf = orientation
            if not exf is None and not image._getexif() is None:
                exif = dict(image._getexif().items())

                if exif[exf] == 3:
                    image = image.transpose(Image.ROTATE_180)
                elif exif[exf] == 6:
                    image = image.transpose(Image.ROTATE_270)
                elif exif[exf] == 8:
                    image = image.transpose(Image.ROTATE_90)

            # Se tiver a tupla de dimensoes, defina e salve
            if not size is None:
                image.thumbnail(size)
            # Se tiver o novo nome então salve neste novocaminho
            if not novo_nome is None:
                image.convert('RGB').save(novo_nome, quality=100, subsampling=0)
            else:
                #image.save(filepath, quality=100)
                image.convert('RGB').save(filepath,  quality=100, subsampling=0)
            image.close()
            return True
        except (AttributeError, KeyError, IndexError):
            # cases: image don't have getexif
            print("ERRO FUNCAO DE ROTACIONAR IMAGEM")
            return False
            pass
        return False

    @staticmethod
    def save_files(path_save_files: str, list_files: Flask.request_class, return_name_original: bool = False) -> dict:
        ''' Recebe um caminho e um objeto request.files onde se faz validação para salvar os arquivos

        Parameters:
            path_save_files: Uma string que representa o caminho onde salvaro arquivo
            list_files: Um objeto (request.files do flask) que dará acesso ao getlist com atributo 'arquivo' para salvar as imagens
            return_name_original: Um boleano que determina se o nome original do arquivo deve ser mantido
        
        Examples:
            >>> lista_de_arquivos = request.files # Vindo de um contexto Flask com atributo do body com nome arquivo
            >>> Imagens.save_files('/imagens/backup', lista_de_arquivos, False)
            {1: 'blablablaxsdw.png', 2: 'blublubluxsdsdf.png'}
            >>> lista_de_arquivos = request.files # Vindo de um contexto Flask com atributo do body com nome arquivo
            >>> Imagens.save_files('/imagens/backup', lista_de_arquivos, True)
            {1: {
                'novo_nome': 'blablablaxsdw.png',
                'nome_original': 'arquivo.png',
                } 
            }
            # EM UM CONTEXTO DE ERRO
            >>> lista_de_arquivos = request.files # Vindo de um contexto Flask com atributo do body com nome arquivo mas sem arquivos
            >>> Imagens.save_files('/imagens/backup', lista_de_arquivos, True)
            {'erro': 'Se esta tentando enviar anexo, coloque ao menos 1', 'codigo': 19}
        '''
        
        # Verifica se tem ao menos um arquivo
        arquivos = list_files.getlist('arquivo')
        #
        arquivos_salvos = {}
                    
        if len(arquivos) < 1:
            return {'erro': 'Se esta tentando enviar anexo, coloque ao menos 1', 'codigo': 19}
        
        # Gera o nome para cada arquivo e os armazena
        for n, arquivo in enumerate(arquivos, 1):
            if len(arquivo.filename) < 1 or arquivo.filename.find('.') == -1:
                return {'erro': 'O anexo inserido nao tem arquivo', 'codigo': 19}
            novo_nome = sha1( str( time.time() + n ).encode() ).hexdigest()
            # Divide o nome do arquivo e extensao
            
            _, ext = arquivo.filename.rsplit('.', 1)
            # Salve o arquivo
            novo_nome = '{}.{}'.format(novo_nome, ext)

            CAMINHO = os.path.join(path_save_files, novo_nome )

            arquivo.save( CAMINHO )
            # Agora verifica se é uma imagem, caso seja precisa aplicar 
            # Uma verificação para saber se terá que rotaciona-la
            if ext.lower() in ['png', 'jpg', 'jpeg']:
                Imagens.rotate_image(CAMINHO)
            # Casos onde queremos ter o retorno do nome original tambem
            if return_name_original:
                arquivos_salvos[n] = {
                    'novo_nome': novo_nome,
                    'nome_original': arquivo.filename
                }
            else:
                arquivos_salvos[n] = novo_nome

        return arquivos_salvos