build_docker:
	docker buildx build --load --platform linux/amd64 -t referral-reward .