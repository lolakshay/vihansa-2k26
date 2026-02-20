import json
import re

filepath = r'd:\Project and Related Files\Side Projects\vihansa final zip\vihansa-2k26\js\event-details.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_desc(desc):
    # Remove existing contact info block if present
    # Matches simple block: <h3>...Contact Information...</h3>...</div> (optionally multiple p/ul tags)
    # But since HTML structure varies, let's look for the header and remove up to </div>
    if 'Contact Information' in desc:
        # Find where "<h3>...Contact Information" starts
        match = re.search(r'\s*<h3>.*Contact Information.*', desc, re.DOTALL | re.IGNORECASE)
        if match:
             # Keep everything before the match and append closing div
             # But wait, the closing </div> is part of the main container, not the contact block
             # We want to remove the contact block which was appended before the last </div>
             # The previous script appended: `\n      <h3>📞 Contact Information</h3>...` before `\n    </div>`
             # So let's split by the contact header, take the first part, and ensure it ends with </div>
             
             # Safer approach: Split by the known header start
             parts = re.split(r'\s*<h3>.*Contact Information.*', desc, maxsplit=1, flags=re.IGNORECASE)
             if len(parts) > 0:
                 cleaned = parts[0]
                 # If we stripped everything after contact info, we lost the closing </div>
                 # So we need to add it back
                 if not cleaned.strip().endswith('</div>'):
                     cleaned = cleaned.rstrip() + '\n    </div>'
                 return cleaned
    return desc

def add_contact(desc, contact_html):
    cleaned = clean_desc(desc)
    # Insert new contact info before the last closing div
    idx = cleaned.rfind('</div>')
    if idx == -1:
        return cleaned + contact_html
    return cleaned[:idx].rstrip() + '\n\n' + contact_html + '\n    </div>'

updates = {
    'paper-presentation': """      <h3>📞 Contact Information</h3>
      <ul>
        <li><strong>Rajeshwari.V</strong> - <a href="tel:+916383530080" style="color: #00f0ff;">6383530080</a></li>
        <li><strong>Rajeswari.R</strong> - <a href="tel:+916369689710" style="color: #00f0ff;">6369689710</a></li>
        <li><strong>Abarna.M</strong> - <a href="tel:+916380341813" style="color: #00f0ff;">6380341813</a></li>
      </ul>""",

    'promptly': """      <h3>📞 Contact Information</h3>
      <ul>
        <li><strong>Archana</strong> - <a href="tel:+918248044306" style="color: #00f0ff;">8248044306</a></li>
        <li><strong>Krishnakanth</strong> - <a href="tel:+918089273331" style="color: #00f0ff;">8089273331</a></li>
      </ul>""",

    'speedcraft': """      <h3>📞 Contact Information</h3>
      <ul>
        <li><strong>Ashwini</strong> - <a href="tel:+919659189110" style="color: #00f0ff;">9659189110</a></li>
        <li><strong>Varsha</strong> - <a href="tel:+919345910919" style="color: #00f0ff;">9345910919</a></li>
      </ul>""",

    'dasheddata': """      <h3>📞 Contact Information</h3>
      <ul>
        <li><strong>Senthoor Balan</strong> - <a href="tel:+917373077820" style="color: #00f0ff;">7373077820</a></li>
        <li><strong>Nirupathunga</strong> - <a href="tel:+919345320689" style="color: #00f0ff;">9345320689</a></li>
      </ul>""",

    'quizzy': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> R.Santhosh kumar - <a href="tel:+919344879024" style="color: #00f0ff;">9344879024</a></p>""",

    'bestmanager': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> Jaikumar A - <a href="tel:+918056352086" style="color: #00f0ff;">8056352086</a></p>""",

    'evehicle': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> S.Sudharshun - <a href="tel:+918610846046" style="color: #00f0ff;">8610846046</a></p>""",

    'productpitch': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Akash A - <a href="tel:+916379136269" style="color: #00f0ff;">6379136269</a></p>""",

    'capturetheflag': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Gangaa TM - <a href="tel:+918807305227" style="color: #00f0ff;">8807305227</a></p>""",

    'roborush': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Sharmili E - <a href="tel:+918015400957" style="color: #00f0ff;">8015400957</a></p>""",

    'cloudcraft': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Hariharasudhan M - <a href="tel:+919786869989" style="color: #00f0ff;">9786869989</a></p>""",

    'report-rendering': """      <h3>📞 Contact Information</h3>
      <ul>
        <li><strong>AKASH P M</strong> - <a href="tel:+919384191321" style="color: #00f0ff;">9384191321</a></li>
        <li><strong>Moshumee .S</strong> - <a href="tel:+918825789622" style="color: #00f0ff;">8825789622</a></li>
        <li><strong>Nivarthi.C</strong> - <a href="tel:+919363924029" style="color: #00f0ff;">9363924029</a></li>
        <li><strong>Tharani B.S</strong> - <a href="tel:+919342642041" style="color: #00f0ff;">9342642041</a></li>
      </ul>""",

    'project-expo': """      <h3>📞 Contact Information</h3>
      <ul>
        <li><strong>Harshini.A</strong> - <a href="tel:+916385914530" style="color: #00f0ff;">6385914530</a></li>
        <li><strong>Mutharasi R</strong> - <a href="tel:+918056516094" style="color: #00f0ff;">8056516094</a></li>
        <li><strong>Subashini B</strong> - <a href="tel:+918754211587" style="color: #00f0ff;">8754211587</a></li>
      </ul>""",

    'circuitsurge': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Aswin Rio R - <a href="tel:+918270893039" style="color: #00f0ff;">8270893039</a></p>
      <p><strong>Staff Coordinator:</strong> Mr.S.Munaf - <a href="tel:+919786903037" style="color: #00f0ff;">9786903037</a></p>""",

    'bidsmash': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Anushika M - <a href="tel:+919677350947" style="color: #00f0ff;">9677350947</a></p>
      <p><strong>Staff Coordinator:</strong> Ms.S.Dhivya - <a href="tel:+919489259542" style="color: #00f0ff;">9489259542</a></p>""",

    'codewar': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Thiriveni NS - <a href="tel:+916374699891" style="color: #00f0ff;">6374699891</a></p>
      <p><strong>Staff Coordinator:</strong> Ms.P.Devi - <a href="tel:+919003666103" style="color: #00f0ff;">9003666103</a></p>""",

    'pcbbuild': """      <h3>📞 Contact Information</h3>
      <p><strong>Student Coordinator:</strong> Janani R - <a href="tel:+919345072602" style="color: #00f0ff;">9345072602</a></p>
      <p><strong>Staff Coordinator:</strong> Mr.V.Ganesh - <a href="tel:+919384302282" style="color: #00f0ff;">9384302282</a></p>""",

    'solelymelodia': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> Ashwin - <a href="tel:+917708282109" style="color: #00f0ff;">7708282109</a></p>""",

    'rythmicmotion': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> Sudeesh - <a href="tel:+919943442244" style="color: #00f0ff;">9943442244</a></p>""",

    'artofone': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> Nandhagopal - <a href="tel:+918754890320" style="color: #00f0ff;">8754890320</a></p>""",

    'tunemorph': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> Nandhagopal - <a href="tel:+918754890320" style="color: #00f0ff;">8754890320</a></p>""",

    'pixelperfect': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> Nidhun - <a href="tel:+918903630686" style="color: #00f0ff;">8903630686</a></p>""",

    'visualvignetic': """      <h3>📞 Contact Information</h3>
      <p><strong>Coordinator:</strong> Praneeth - <a href="tel:+919363624383" style="color: #00f0ff;">9363624383</a></p>"""
}

# Apply updates
for key, content in updates.items():
    if key in data:
        # First clean existing contact info
        cleaned = clean_desc(data[key]['desc'])
        # Then add new one
        data[key]['desc'] = add_contact(cleaned, content)
        print(f"Updated: {key}")
    else:
        print(f"Warning: Key {key} not found in JSON data")


with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Finished updating event details.")
