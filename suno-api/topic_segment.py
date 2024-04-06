import os
import json

from openai import OpenAI
from dotenv import load_dotenv

class TopicSegmenter:
	client: OpenAI

	def __init__(self):
		load_dotenv()
		print(os.environ)
		api_key = os.getenv("OPENAI_KEY")
		print(api_key)
		self.client = OpenAI(api_key=api_key)
		

	def segment_topic(self, text: str):
			
		num_topics = 6

		prompt = f'Extract {num_topics} different topics in the following text. Topics must not overlap. For each topic, provide a short title no longer than 4 words. Then, for each topic, write a detailed 1-paragraph encyclopedia-style summary about the topic in simple terms. Format your response in JSON format of "topic": " 1-paragraph summary"\n\n{text}'


		response = self.client.chat.completions.create(model="gpt-4-turbo-preview",
		messages=[
		{"role": "user", "content": prompt}
		], 
		temperature=0.7,
		max_tokens=3000)

		out = response.choices[0].message.content

		print(out)

		# Remove the Markdown code block syntax (backticks and 'json')
		out_clean = out.strip('`').replace('json\n', '')

		# Convert the cleaned JSON string to a Python dictionary
		data = json.loads(out_clean)
		print(data)
		# Write the dictionary to a file as JSON
		with open('output.json', 'w') as file:
			json.dump(data, file, indent=4)

		return [{"topic": key, "lyrics": data[key]} for key in data]

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

if __name__ == "__main__":
	with open('sample_1.txt', 'r') as file:
		text = file.read()
		segmenter = TopicSegmenter()
		segmenter.segment_topic(text)