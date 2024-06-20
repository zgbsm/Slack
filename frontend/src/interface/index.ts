export interface TableTabs {
    title: string;
    name: string;
    content: any[];
    total: number;
    pageSize: number;
    currentPage: number;
}

export interface URLFingerMap {
    url: string,
    finger: string[]
}

export interface PortScanData {
    IP: string
    Port: number
    Server: string
    Link: string
    HttpTitle: string
}

export interface Vulnerability {
    vulID: string
    vulName: string
    protocoltype: string
    severity: string
    vulURL: string
    request: string
    response: string
    extInfo: string
    reference: string
    description: string
}

export interface FingerprintTable {
    url: string
    status: string
    length: string
    title: string
    detect: string
    existsWaf: boolean
    waf: string
    fingerprint: FingerLevel[]
}


export interface FingerLevel {
    name: string
    level: number // level 0 is default , level 1 is high risk
}

export interface Dir {
    Status: number
    URL: string
    Location: string
    Length: number
}

export interface DirScanOptions {
    Method: string
    URL: string
    Paths: string[]
    Workers: number
    Timeout: number
    BodyExclude: string
    BodyLengthExcludeTimes: number
    StatusCodeExclude: number[]
    FailedCounts: number
    Redirect: boolean
    Interval: number
    CustomHeader: string
}

export interface ProxyOptions {
    Enabled: boolean
	Mode:     string
	Address:  string
	Port:     number
	Username: string
	Password: string
}

export interface FofaResult {
    Error?: boolean
	Message?: string
	Size?:    number
	Results?: Results[]
}

export interface Results {
    URL:      string
	Host:     string
	Title:    string
	IP:       string
	Port:     string
	Domain:   string
	Protocol: string
	Region:   string
	ICP:      string
}

export interface LocalOpitons {
    Name: string
    Children: Child[] | null
}

export interface Child {
    Name: string
    Type: string
    Path: string
}

export interface File {
    Error?: boolean
    Message?: string
    Content?: string
}

export interface HunterEntryTips {
    value: string
    assetNum: number
    tags: string[]
}

export interface RuleForm {
    name?: string
    desc?: string
}