import re
import json

with open(r'c:\Users\KEERTHI VASAN\Downloads\vihansa latest\vihansa-2k26\js\main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the eventDetails object content
match = re.search(r'const eventDetails = (\{.*?\n\});', content, re.DOTALL)
if match:
    obj_str = match.group(1)
    
    # We need to turn this into valid JSON.
    # 1. Replace single-quoted keys with double-quoted ones
    # 2. Replace single-quoted values with double-quoted ones (careful with internal quotes)
    # 3. Handle backtick strings (desc)
    
    # This is tricky with regex. Let's try a simpler approach if possible.
    # Actually, I can just use a JS environment to do this if I had one.
    # Since I don't, I'll do some basic cleaning.
    
    # Remove comments
    obj_str = re.sub(r'//.*', '', obj_str)
    
    # Replace single quotes on keys
    obj_str = re.sub(r"^\s*'(\w+)':", r'  "\1":', obj_str, flags=re.MULTILINE)
    
    # Replace backticks on values for desc
    obj_str = re.sub(r": `(.*?)`", lambda m: ': ' + json.dumps(m.group(1).replace('\n', ' ')), obj_str, flags=re.DOTALL)
    
    # Replace single quotes on values
    obj_str = re.sub(r": '(.*?)'", r': "\1"', obj_str)
    
    # Fix trailing commas if any (JSON doesn't like them)
    obj_str = re.sub(r',\s*\}', '\n}', obj_str)
    
    # Try to parse it to check
    try:
        data = json.loads(obj_str)
        with open(r'c:\Users\KEERTHI VASAN\Downloads\vihansa latest\vihansa-2k26\js\event-details.json', 'w', encoding='utf-8') as out:
            json.dump(data, out, indent=2)
        print("Successfully created event-details.json")
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        # Print a snippet for debugging
        print(obj_str[:500])
else:
    print("Could not find eventDetails object")
