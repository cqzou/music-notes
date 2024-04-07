def find_topic_by_topicname(topics, topicname):
    for index, topic in enumerate(topics):
        if topic.get('topicname') == topicname:
            return index
    return None
def find_project_by_id(projects, projectid):
    for index, proj in enumerate(projects):
        if proj.get('projectid') == projectid:
            return index
    return None

async def create_empty_project(client, userid, project):
    project = project.model_dump()
    collection = client['thelasthackbackend']['users']
    result = collection.find_one({'userid':userid}, {'_id': 0})
    
    if result and "projects" in result:
        projects = result["projects"]
        if not any(proj for proj in projects if proj.get('projectid') == project.get('projectid')):
            # Add the new project to the projects list
            projects.append(project)
            
            # Update the user's document with the new list of projects
            update_result = collection.update_one({'userid': userid}, {'$set': {'projects': projects}})
            print(update_result)
            return {"success": True, "message": "Project added successfully.", "data": projects[::-1]}
        else:
            return {"success": False, "message": "Project already exists."}
    else:
        # If the user doesn't have any projects, initialize with the new project
        update_result = collection.update_one({'userid': userid}, {'$set': {'projects': [project]}}, upsert=True)
        print(update_result)
        return {"success": True, "message": "Project added successfully as the first project."}
    
async def update_audio_url(client, userid, projectid, topicname, new_audio_url, audio_id, status):
    collection = client['thelasthackbackend']['users']
    result = collection.find_one({'userid':userid}, {'_id': 0})   

    if result and "projects" in result:
        projects = result["projects"]
        proj_index = find_project_by_id(projects, projectid)
        if proj_index is not None:
            project = projects[proj_index].copy()
            topic_index = find_topic_by_topicname(topics=project["topics"], topicname=topicname)
            if topic_index is not None:
                project["topics"][topic_index]["mp3"] = new_audio_url
                project["topics"][topic_index]["aid"] = audio_id
                project["topics"][topic_index]["status"] = status
                projects[proj_index] = project
                update_result = collection.update_one({'userid': userid}, {'$set': {'projects': projects}})
                print(update_result)
                return {"success": True, "message": "Project updated successfully."}
            else:
                return {"success": True, "message": "uhhh i can't find the topic??"}
        else:
            return {"success": True, "message": "uhh i can't find the project"}
    else:
        #
        return {"success": True, "message": "No projects found? idk what's goin on here dog u shouldn't be here LOOOL"}

async def update_audio_urls(client, userid, projectid, topicnames, new_audio_urls, audio_ids, statuses):
    collection = client['thelasthackbackend']['users']
    result = collection.find_one({'userid':userid}, {'_id': 0})   

    if result and "projects" in result:
        projects = result["projects"]
        proj_index = find_project_by_id(projects, projectid)
        if proj_index is not None:
            project = projects[proj_index].copy()
            for topicname, new_audio_url, audio_id, status in zip(topicnames, new_audio_urls, audio_ids, statuses):
                topic_index = find_topic_by_topicname(topics=project["topics"], topicname=topicname)
                if topic_index is not None:
                    project["topics"][topic_index]["mp3"] = new_audio_url
                    project["topics"][topic_index]["aid"] = audio_id
                    project["topics"][topic_index]["status"] = status
                    
                else:
                    return {"success": True, "message": "uhhh i can't find the topic??"}
            projects[proj_index] = project
            update_result = collection.update_one({'userid': userid}, {'$set': {'projects': projects}})
            print(update_result)
            return {"success": True, "message": "Project updated successfully.", "data": projects[::-1]}
        else:
            return {"success": True, "message": "uhh i can't find the project"}
    else:
        #
        return {"success": True, "message": "No projects found? idk what's goin on here dog u shouldn't be here LOOOL"}
    
async def update_project_completion_status(client, userid, projectid, image_url):
    collection = client['thelasthackbackend']['users']
    result = collection.find_one({'userid':userid}, {'_id': 0})   

    if result and "projects" in result:
        projects = result["projects"]
        proj_index = find_project_by_id(projects, projectid)
        if proj_index is not None:
            project = projects[proj_index].copy()
            project["processingstatus"] = "complete"
            project["thumbnail"] = image_url
            projects[proj_index] = project
            update_result = collection.update_one({'userid': userid}, {'$set': {'projects': projects}})
            print(update_result)
            return {"success": True, "message": "Project updated successfully."}
        else:
            return {"success": True, "message": "uhh i can't find the project"}
    else:
        #
        return {"success": True, "message": "No projects found? idk what's goin on here dog u shouldn't be here LOOOL"}

async def delete_project(client, userid, projectid):
    collection = client['thelasthackbackend']['users']
    result = collection.find_one({'userid':userid}, {'_id': 0})
    
    if result and "projects" in result:
        projects = result["projects"]
        print(projects)
        if any(proj for proj in projects if proj.get('projectid') == projectid):
            # Add the new project to the projects list
            def fun(variable):
                return variable.get('projectid') != projectid
            projects = list(filter(fun, projects))
            
            # Update the user's document with the new list of projects
            update_result = collection.update_one({'userid': userid}, {'$set': {'projects': projects}})
            print(update_result)
            return {"success": True, "message": "Project deleted successfully.", "data": projects[::-1]}
        else:
            return {"success": True, "message": "No projects present"}
    else:
        return {"success": True, "message": "No projects present"}