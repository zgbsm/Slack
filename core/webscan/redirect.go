package webscan

import (
	"net/http"
	"regexp"
	"slack-wails/lib/clients"
	"strings"
)

var (
	reg1 = regexp.MustCompile(`(?i)<meta.*?http-equiv=.*?refresh.*?url=(.*?)/?>`)
	reg2 = regexp.MustCompile(`(?i)[window\.]?location[\.href]?.*?=.*?["'](.*?)["']`)
	reg3 = regexp.MustCompile(`(?i)window\.location\.replace\(['"](.*?)['"]\)`)
)

// https://github.com/SleepingBag945/dddd/blob/4c428a7c171275bfbb5fa72c2fb4bd7b48f4ff4a/lib/httpx/runner/runner.go#L570
func checkJSRedirect(Raw string) string {
	matches := reg1.FindAllStringSubmatch(Raw, -1)
	if len(matches) > 0 {
		// 去除注释的情况
		if !strings.Contains(Raw, "<!--\r\n"+matches[0][0]) && !strings.Contains(matches[0][1], "nojavascript.html") && !strings.Contains(Raw, "<!--[if lt IE 7]>\n"+matches[0][0]) {
			return strings.Trim(matches[0][1], "\"")
		}
	}
	body := Raw
	if len(body) > 700 {
		body = body[:700]
	}
	matches = reg2.FindAllStringSubmatch(body, -1)
	if len(matches) > 0 {
		return strings.Trim(matches[0][1], "\"")
	}
	matches = reg3.FindAllStringSubmatch(body, -1)
	if len(matches) > 0 {
		return strings.Trim(matches[0][1], "\"")
	}
	return ""
}

func getRealPath(url string) string {
	if strings.Contains(url, "#") {
		t := strings.Split(url, "#")
		url = t[0]
	}
	if strings.Count(url, "/") == 2 {
		return url
	}
	t := strings.Split(url, "/")
	return strings.Join(t[:len(t)-1], "/")
}

// 如果网站请求的报错内容不包含传入的url，则认为请求被重定向到其他不可访问的网页导致，则使用不跟随跳转的client进行请求获取响应头信息
func getRedirectHeader(err error, url string, notFollowClient *http.Client) (*http.Response, []byte) {
	if !strings.Contains(err.Error(), url) {
		resp, _, err := clients.NewSimpleGetRequest(url, notFollowClient)
		if err != nil || resp == nil {
			return nil, nil
		}
		headers, _, _ := DumpResponseHeadersAndRaw(resp)
		return resp, headers
	}
	return nil, nil
}
