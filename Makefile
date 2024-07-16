all: build_source build_docker create_tag push_source
build_source: 
	yarn build
build_docker:
	docker buildx build  --load --platform linux/amd64 \
	-t referral-reward .
create_tag:
	docker tag referral-reward:latest lungern/referral-reward:latest
push_source:
	docker push lungern/referral-reward:latest

