.PHONY: test deploy copy css

test:
	node baseball/test/CareerSpec.js

deploy:
	(cd baseball-angular && npm run build) && make copy

copy:
	rm -rf ../../public/*
	cp -R ./baseball-angular/dist/* ../../public
	mv ../../public/index.html ../../index.html
	mv ../../public/public/* ../../public/

css:
	npx lessc styles/application.less > ./baseball-angular/src/public/application.css
