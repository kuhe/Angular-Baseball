.PHONY: test deploy copy css baseball

test:
	node baseball/test/CareerSpec.js

deploy: baseball css
	(cd baseball-angular && npm run build) && make copy

baseball:
	(cd baseball && npm run build)

watch-baseball:
	(cd baseball && npm run watch)

copy:
	node copy.js

css:
	npx lessc styles/application.less > ./baseball-angular/src/public/application.css
