import os
import webbrowser as web
import pyfiglet # type: ignore
import pandas as pd  # type: ignore
from glob import glob
from warnings import warn
import shutil

base_path = os.path.dirname(os.path.abspath(__file__))
print(base_path)

print(pyfiglet.figlet_format("EFFPROG STUDY"))
ID     = input('Please enter the SUBJECT ID NUMBER: ')
AGE    = input("Please enter the subject's AGE: ")
SEX    = input("Please enter the subject's SEX: ")
DEBUG  = input("Is it DEBUG mode (true/false)? ")

_data = 'var tmp = \'[{"ID" : "' + ID + '", "AGE" : "'+AGE+'", "SEX" : "'+SEX+'", "DEBUG" : "'+DEBUG+'"} ]\'';



with open(os.path.join(base_path,'tmp.js'), 'w') as f:
    f.write(_data)

#with open('tmp.js', 'w') as f:
    #need to create tmp.js where index.html is
    #f.write(_data)

html_path = os.path.join(base_path, 'index.html')
web.open('file://' + html_path)
#web.open('file://' + os.path.realpath('index.html'))

print('='*20)
input('EXPERIMENTER: Press ENTER when experiment is done.')

# remove tmp 
#os.remove('tmp.js')
os.remove(os.path.join(base_path,'tmp.js'))

# get data file
HOME = os.path.expanduser('~')
files = [
    f for f in glob(f'{HOME}/Downloads/*.csv')
    if f'oddball_{ID}_' in os.path.basename(f)
]

if not files:
    raise FileNotFoundError(f"No CSV found for subject {ID}")

# Select the most recently modified file
file = max(files, key=os.path.getmtime)

print(f"Using data file: {file}")

# print earnings
sub      = pd.read_csv(file)
earnings = sub.total_bonus.max()

print('='*20)
print(f'Pay subject a bonus of ${earnings}')

# move file to data/
print('='*20)
try: 
    shutil.move(file, file.replace(f'{HOME}/Downloads/', 'data/'))
    print('data successfully moved to data/ folder')
except:
    print('could not move data to data/ folder. Check manually.')



