from flask import Blueprint, Flask, request, render_template
from flask_pymongo import PyMongo
from urllib.parse import quote_plus, unquote_plus
from dotenv import load_dotenv
import os

load_dotenv('.env')

app = Flask(__name__,static_url_path='',static_folder='static',)
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
mongo = PyMongo(app)
food_collection = mongo.db.foodinfo

sortSwitch = {
    0: ['name',1],
    1: ['name',-1],
    2: ['group',1],
    3: ['group',-1],
}

def onegram(data):
    convData = float(str(data))
    convData /= 100
    return convData

@app.route('/')
def index():
    return render_template('pages/landing.html',cursor="home")

@app.route('/top')
def topData():
    agg_pipe = []
    display = []

    agg_pipe.append({'$match':{"$and":[{"group":{"$ne":""}},{"group":{"$ne":None}}]}})
    agg_pipe.append({"$group" : {'_id':"$group", 'groupname':{'$first':'$group'} }})
    agg_pipe.append({"$sort" : {'groupname': 1}})
    for x in food_collection.aggregate(agg_pipe):
        sub_agg_pipe = []
        sub_agg_pipe.append({'$match': {'group':x['groupname']} })
        sub_agg_pipe.append({'$project': {'fat': '$fat','carbs': '$carbs','name': '$name' ,'Keto': {'$cond': { 'if': { '$gt': [ "$fat", '$carbs' ] }, 'then': {'$subtract':['$fat','$carbs']}, 'else': 0 }} } })
        sub_agg_pipe.append({'$match':{'Keto':{'$gt':0}}})
        sub_agg_pipe.append({'$sort': {'Keto': -1}})
        sub_agg_pipe.append({'$limit':5})

        topdata = []
        for y in food_collection.aggregate(sub_agg_pipe):
            yFat = 0 if y['fat'] == None else float(str(y['fat']))
            yCarbs = 0 if y['carbs'] == None else float(str(y['carbs']))
            topdata.append({'name': y['name'],'fat': yFat,'carbs': yCarbs })
        
        display.append({'group':x['groupname'], 'topdata':topdata })
    return render_template('pages/top.html',pergroup=display,cursor="top")

@app.route('/search',methods = ['GET'])
def search():
    pageNo = 0 if request.args.get("page") is None or int(request.args.get("page")) <= 0 else int(request.args.get("page")) - 1 
    getSort = 0 if request.args.get('sort') is None else request.args.get('sort')
    getName = request.args.get('name')

    sortMethod = sortSwitch.get(int(getSort),['name',1])
    setLimit = 5
    skipStart = 0
    countReturn = 0
    skipStart = setLimit * pageNo
    display = []
    agg_pipe = []

    if getName:
        isStrict = getName[0:1]
        isStricter = getName[1:2]
        clearName = getName[1:]
        clearerName = getName[2:]

        if ":" != str(isStrict):
            if "*" != str(isStrict):
                agg_pipe.append({'$search': {'index': 'food_search','text': {'query': getName,'path': {'wildcard': '*'}}}})
            else:
                if "*" != str(isStricter):
                    agg_pipe.append({'$match': {'group':{'$regex':clearName}} })
                else:
                    agg_pipe.append({'$match': {'group':clearerName} })
        else: 
            if ":" != str(isStricter):
                agg_pipe.append({'$match': {'name':{'$regex':clearName}} })
            else:
                agg_pipe.append({'$match': {'name':clearerName} })

    agg_pipe.append({'$match':{"$and":[{"group":{"$ne":""}},{"group":{"$ne":None}}]}})
    agg_pipe.append({'$sort': {sortMethod[0]: sortMethod[1]}})
    agg_pipe.append({'$skip':skipStart})
    agg_pipe.append({'$limit':setLimit})

    for x in food_collection.aggregate(agg_pipe):
        display.append({'url':quote_plus(x['name']),'carbs': onegram(x['carbs']), 'name':x['name'], 'group':x['group'] })
        countReturn += 1

    return render_template('pages/results.html',results=display,name=getName,page=pageNo+1,sort=getSort,countreturn=countReturn)

@app.route('/result/data',methods = ['GET'])
def data():
    name = unquote_plus(request.args.get('name'))
    foodData = {}
    gd = food_collection.find_one({'name': name}, {'_id':0})
    for attr, value in gd.items():
        if attr != "serv":
            passVal = value
            if type(value) != str:
                passVal = onegram(float(str(value)))
            foodData[attr] = passVal
        else:
            foodData[attr] = []
            for serv_attr, serv_data in reversed(gd[attr].items()):
                foodData[attr].append({'weight': serv_data['weight'],'desc': serv_data['desc']})

    return render_template('pages/data.html',data=foodData)

@app.route('/about')
def about():
    return render_template('pages/about.html',cursor="about")

if __name__ == '__main__':
    app.run()