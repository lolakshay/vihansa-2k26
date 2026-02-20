import json

filepath = r'd:\Project and Related Files\Side Projects\vihansa final zip\vihansa-2k26\js\event-details.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

def add_contact_before_div(desc, contact_html):
    idx = desc.rfind('</div>')
    if idx == -1:
        return desc + contact_html
    return desc[:idx] + contact_html + '\n    </div>'

updates = {
    'circuitsurge': '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Student Coordinator:</strong> Aswin Rio R - <a href="tel:+918270893039" style="color: #00f0ff;">8270893039</a></p>\n      <p><strong>Staff Coordinator:</strong> Mr.S.Munaf - <a href="tel:+919786903037" style="color: #00f0ff;">9786903037</a></p>',
    'bidsmash': '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Student Coordinator:</strong> Anushika M - <a href="tel:+919677350947" style="color: #00f0ff;">9677350947</a></p>\n      <p><strong>Staff Coordinator:</strong> Ms.S.Dhivya - <a href="tel:+919489259542" style="color: #00f0ff;">9489259542</a></p>',
    'solelymelodia': '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Coordinator:</strong> Ashwin - <a href="tel:+917708282109" style="color: #00f0ff;">7708282109</a></p>',
    'rythmicmotion': '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Coordinator:</strong> Sudeesh - <a href="tel:+919943442244" style="color: #00f0ff;">9943442244</a></p>',
    'artofone': '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Coordinator:</strong> Nandhagopal - <a href="tel:+918754890320" style="color: #00f0ff;">8754890320</a></p>',
    'visualvignetic': '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Coordinator:</strong> Praneeth - <a href="tel:+919363624383" style="color: #00f0ff;">9363624383</a></p>',
    'pixelperfect': '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Coordinator:</strong> Nidhun - <a href="tel:+918903630686" style="color: #00f0ff;">8903630686</a></p>',
}

for key, contact in updates.items():
    if key in data:
        if 'Contact Information' not in data[key]['desc']:
            data[key]['desc'] = add_contact_before_div(data[key]['desc'], contact)
            print('Updated: ' + key)
        else:
            print('Skipped (already has contact): ' + key)
    else:
        print('Not found: ' + key)

# Update Tech Quiz contacts
if 'codewar' in data:
    d = data['codewar']['desc']
    if 'Aswin Rio' in d:
        d = d.replace('Aswin Rio.R', 'Thiriveni NS')
        d = d.replace('+91 8270893039', '6374699891')
        # Add staff coordinator before the closing </p>\n    </div>
        if 'Ms.P.Devi' not in d:
            d = d.replace('6374699891</a></p>', '6374699891</a></p>\n      <p><strong>Staff Coordinator:</strong> Ms.P.Devi - <a href="tel:+919003666103" style="color: #00f0ff;">9003666103</a></p>')
        data['codewar']['desc'] = d
        print('Updated: codewar (Tech Quiz)')
    else:
        print('Skipped codewar: Aswin Rio not found, checking current contacts')
        if 'Thiriveni' in d:
            print('  Already has Thiriveni NS')
        if 'Ms.P.Devi' not in d and 'Contact Information' in d:
            d = d.replace('</p>\n    </div>', '</p>\n      <p><strong>Staff Coordinator:</strong> Ms.P.Devi - <a href="tel:+919003666103" style="color: #00f0ff;">9003666103</a></p>\n    </div>')
            data['codewar']['desc'] = d
            print('  Added Ms.P.Devi')

# Update PCB Build
if 'pcbbuild' in data:
    if 'Contact Information' not in data['pcbbuild']['desc']:
        data['pcbbuild']['desc'] = '<div class="event-full-desc">\n      <p><strong>PCB BUILD</strong> - Learn PCB design fundamentals and assemble your own boards with expert guidance!</p>\n\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Student Coordinator:</strong> Janani R - <a href="tel:+919345072602" style="color: #00f0ff;">9345072602</a></p>\n      <p><strong>Staff Coordinator:</strong> Mr.V.Ganesh - <a href="tel:+919384302282" style="color: #00f0ff;">9384302282</a></p>\n    </div>'
        print('Updated: pcbbuild')
    else:
        print('Skipped pcbbuild (already has contact)')

# Also ensure Paper Presentation has contacts (already edited via multi_replace)
if 'paper-presentation' in data:
    if 'Contact Information' in data['paper-presentation']['desc']:
        print('Paper presentation: OK')
    else:
        contact = '\n      <h3>\U0001f4de Contact Information</h3>\n      <ul>\n        <li><strong>Rajeshwari.V</strong> - <a href="tel:+916383530080" style="color: #00f0ff;">6383530080</a></li>\n        <li><strong>Rajeswari.R</strong> - <a href="tel:+916369689710" style="color: #00f0ff;">6369689710</a></li>\n        <li><strong>Abarna.M</strong> - <a href="tel:+916380341813" style="color: #00f0ff;">6380341813</a></li>\n      </ul>'
        data['paper-presentation']['desc'] = add_contact_before_div(data['paper-presentation']['desc'], contact)
        print('Updated: paper-presentation')

# Adaptune already updated via multi_replace
if 'tunemorph' in data:
    if 'Contact Information' in data['tunemorph']['desc']:
        print('Adaptune: OK')
    else:
        contact = '\n      <h3>\U0001f4de Contact Information</h3>\n      <p><strong>Coordinator:</strong> Nandhagopal - <a href="tel:+918754890320" style="color: #00f0ff;">8754890320</a></p>'
        data['tunemorph']['desc'] = add_contact_before_div(data['tunemorph']['desc'], contact)
        print('Updated: tunemorph (Adaptune)')

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print('\nAll updates complete!')
