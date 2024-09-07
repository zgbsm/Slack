import { Callgologger, PortBrute, NewWebScanner, NucleiEnabled, LoadDirsearchDict, DirScan, HunterSearch, Subdomain } from 'wailsjs/go/main/App'
import global from '@/global'
import async from 'async';
import { DirScanOptions, NulceiOptions, SubdomainOption } from '@/interface';
import { ElMessage, ElNotification } from 'element-plus';


export async function LinkWebscan(ips: string[]) {
    if (!(await NucleiEnabled(global.webscan.nucleiEngine))) {
        ElMessage.warning(`Nuclei引擎无效，无法进行漏洞扫描，已结束！`)
        return
    }
    let option: NulceiOptions = {
        Mode: 0,
        CustomTags: [],
        Engine: global.webscan.nucleiEngine,
        Risk: "",
        Interactsh: false,
        Proxy: global.proxy
    }

    await NewWebScanner(ips, global.proxy, 50 ,true, true, true, option)
}

export function LinkCrack(ips: string[]) {
    let id = 0
    async.eachLimit(ips, 20, async (target: string, callback: () => void) => {
        let protocol = target.split("://")[0]
        let userDict = global.dict.usernames.find(item => item.name.toLocaleLowerCase() === protocol)?.dic!
        if (global.dict.options.includes(protocol)) {
            Callgologger("info", target + " is start brute")
        }
        await PortBrute(target, userDict, global.dict.passwords)
        id++
        if (id == ips.length) {
            callback()
        }
    }, (err: any) => {
        Callgologger("info", "PortBrute Finished")
        ElNotification.success({
            message: "Crack Finished",
            position: "bottom-right"
        })
    });
}

export async function LinkDirsearch(url: string) {
    ElNotification.success({
        message: "已将目标联动至目录扫描",
        position: "bottom-right"
    })
    let dfp = global.PATH.homedir + "/slack/config/dirsearch/dicc.txt"
    let paths = await LoadDirsearchDict([dfp], "php,aspx,asp,jsp,html,js".split(','))
    global.temp.dirsearchPathConut = paths.length
    global.temp.dirsearchStartTime = Date.now()
    let option: DirScanOptions = {
        Method: "GET",
        URLs: [url],
        Paths: paths,
        Workers: 25,
        Timeout: 8,
        BodyExclude: "",
        BodyLengthExcludeTimes: 5,
        StatusCodeExclude: [404],
        Redirect: false,
        Interval: 0,
        CustomHeader: "",
        Recursion: 0,
    }
    await DirScan(option)
}

export async function LinkHunter(query: string, count: string) {
    if (!global.space.hunterkey) {
        ElNotification.warning("请在设置处填写Hunter Key")
        return
    }
    ElMessage.info("正在导入鹰图数据，请稍后...")
    let urls = <string[]>[]
    let result:any = await HunterSearch(global.space.hunterkey, query, count, "1", "0", "3", false)
    if (result.code !== 200) {
        if (result.code == 40205) {
            ElMessage(result.message)
        } else {
            ElMessage({
                message: result.message,
                type: "error",
            });
            return
        }
    }
    result.data.arr.forEach((item: any) => {
        urls.push(item.url)
    });
    return urls
}

export async function LinkSubdomain(domains: string[]) {
    Callgologger("info", `正在对${domains.length}个域名进行子域名查询，请稍后...`)
    let option: SubdomainOption = {
        Mode: 1,
        Domains: domains,
        Subs: [],
        Thread: 10,
        Timeout: 5,
        DnsServers: ["223.6.6.6:53", "8.8.8.8:53"],
        ResolveExcludeTimes: 5,
        BevigilApi: global.space.bevigil,
        ChaosApi: global.space.chaos,
        SecuritytrailsApi: global.space.securitytrails,
        ZoomeyeApi: global.space.zoomeye,
        GithubApi: global.space.github,
    }
    await Subdomain(option)
}