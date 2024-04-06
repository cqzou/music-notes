import os
import json

from openai import OpenAI
from dotenv import load_dotenv

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

load_dotenv()

with open('sample_1.txt', 'r') as file:
	text = file.read()

prompt = f'Extract 4 to 6 different topics in the following text. Topics must not overlap. For each topic, provide a short title no longer than 4 words. Then, for each topic, write a detailed 2-paragraph encyclopedia-style summary about the topic in simple terms. Format your response in JSON format of "topic": "summary"\n\n{text}'


response = client.chat.completions.create(model="gpt-4-turbo-preview",
messages=[
  {"role": "user", "content": prompt}
], 
temperature=0.7,
max_tokens=3000)
print(response.choices[0].message.content)

# try:
# 	topics_dict = json.loads(response.choices[0].message.content[response.choices[0].message.content.find('{'):response.choices[0].message.content.rfind('}')+1])
# 	for topic_number, topic_title in topics_dict.items():
# 		print(f'{topic_number}: {topic_title}')
# 		topic = topic_title
# 		response = client.chat.completions.create(model="gpt-4-turbo-preview",
# 		messages=[
# 		  {"role": "user", "content": prompt2}
# 		],
# 		temperature=0.7,
# 		max_tokens=1000)
# 		print(response.choices[0].message.content)
# except json.JSONDecodeError:
#     print("Error decoding JSON from response")

