menu.json 파일이 경우 fake json-server 를 활용
메뉴 등록 페이지 개발 시 json 자동 생성 하는 로직 만든다."
nohup json-server --host 100.100.100.142 --watch menu.json --port 8090 1>/dev/null 2>&1 &
별도의 deploy tool 을 사용하고 있지 않기 때문에 nohup 으로 background 프로세스를 실행시킨다.
