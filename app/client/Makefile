.PHONY: test deploy copy css

test:
	node baseball/test/CareerSpec.js

deploy:
	(cd baseball-angular && npm run build) && make copy

copy:
	node copy.js

css:
	npx lessc styles/application.less > ./baseball-angular/src/public/application.css
