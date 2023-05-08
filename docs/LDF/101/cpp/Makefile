all: vulnerable-linux-driver-db.zip

.docker-build: Dockerfile
	docker build -t vulnerable-linux-driver-builder .
	touch .docker-build

vulnerable_linux_driver/Makefile.orig: Makefile.patch
	patch --backup < Makefile.patch
vulnerable-linux-driver-db.zip: vulnerable_linux_driver/Makefile.orig .docker-build
	-make -C vulnerable_linux_driver clean
	docker run -v "$(PWD):/data" vulnerable-linux-driver-builder database create --overwrite -l cpp -s /data/vulnerable_linux_driver /data/vulnerable-linux-driver-db
	codeql database bundle -o vulnerable-linux-driver-db.zip vulnerable-linux-driver-db
	rm -rf vulnerable-linux-driver-db

.PHONY: clean
clean:
	-rm -r vulnerable-linux-driver-db.zip
	-docker rmi -f vulnerable-linux-driver-builder
	-rm .docker-build