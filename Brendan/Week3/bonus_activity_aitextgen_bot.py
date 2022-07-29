from pathlib import Path
import discord
from aitextgen import aitextgen
from discord.ext import commands
import os
from datetime import datetime


bot = commands.Bot(command_prefix='~')
token = ''

ai = aitextgen(model_folder="trained_model")
dirpath = os.getcwd()
now = datetime.now().hour + 1  # this represents EST.


@bot.command()
async def generate(ctx, arg=None):
    '''
    Function: generates text randomly or based on a prompt. 
    '''
    if arg is not None:
        the_prompt = ' '.join(arg)
        if isinstance(the_prompt, str):
            ai.generate_to_file(n=1, max_length=120,
                                prompt=the_prompt, temperature=0.8)
            dirFiles = os.listdir(".")
            dirFiles.sort(reverse=True)
            print(dirFiles)
            file_name = dirFiles[0]
            if (file_name == "trained_model"):
                file_name = dirFiles[1]
            if (file_name == 'drizzy.py'):
                file_name = dirFiles[2]
            print(file_name)
            file = open(file_name, encoding="utf8")
            lines = file.readlines()
            output = ""
            for line in lines:
                output += line
            await ctx.send(output)
        else:
            await ctx.send("Prompt should be a string. Not sure where this went wrong.")
    else:
        ai.generate_to_file(n=1, max_length=120, temperature=0.8)
        dirFiles = os.listdir(".")
        dirFiles.sort(reverse=True)
        print(dirFiles)
        file_name = dirFiles[0]
        if (file_name == "trained_model"):
            file_name = dirFiles[1]
        if (file_name == 'drizzy.py'):
            file_name = dirFiles[2]
        print(file_name)
        file = open(file_name, encoding="utf8")
        lines = file.readlines()
        output = ""
        for line in lines:
            output += line
        await ctx.send(output)

bot.run(token)
