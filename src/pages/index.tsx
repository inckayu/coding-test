import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import axios from 'axios'
import { Article } from '@/types/Article'
import { useRecoilState, useRecoilValue } from 'recoil'
import { qiitaApiTokenState } from '@/state/qiitaApiTokenState'
import { articleTitleState } from '@/state/articleTitleState'
import { Button } from '@/stories/Button'
import MainTextBox from '@/stories/MainTextBox'

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [isValidApiToken, setIsValidApiToken] = useState<boolean>(false)
  const [qiitaApiToken, setQiitaApiToken] =
    useRecoilState<string>(qiitaApiTokenState)
  const articleTitle = useRecoilValue<string>(articleTitleState)

  const handleInputApi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputToken = e.target.value
    setQiitaApiToken(inputToken)
    if (!inputToken.match(/^\w+$/)) {
      console.log('input')
      setIsValidApiToken(false)
    } else {
      setIsValidApiToken(true)
    }
  }

  const handleTitleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault() // フォームが送信されてリロードされないよう
    setIsSearching(true)
    fetchArticles(articleTitle).then((articles) => {
      setArticles(articles)
      setIsSearching(false)
    })
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${qiitaApiToken}`,
    },
  }

  const fetchArticles = async (title: string): Promise<Article[]> => {
    // TODO: configの型定義を追加する
    // TODO: 検索条件は最終的にはオブジェクトとかにまとめて引数として渡すようにする
    // TODO: エラーハンドリングを追加する(APIキーがない場合など)
    const query = `title:${title}`
    const res = await axios.get<Article[]>(
      `https://qiita.com/api/v2/items?per_page=5&query=${query}`,
      config
    )
    return res.data
  }

  useEffect(() => {
    // NOTE: 初期表示時に記事を取得する必要はないかもしれない
    console.log(articleTitle)
    console.log(qiitaApiToken)
    console.log(isValidApiToken)
    if (articleTitle.length && qiitaApiToken.length) {
      //NOTE: 記事詳細画面から戻ってきた場合のみ実行されることを想定しているのでisValidApiTokenはチェックしないが、要検証
      // 依存配列が空だからarticleTitleまたはqiitaApiTokenが変更された場合には実行されないはず
      setIsSearching(true)
      fetchArticles(articleTitle).then((articles) => {
        setArticles(articles)
        setIsSearching(false)
      })
    }
    setIsValidApiToken(true)
  }, [])
  return (
    <>
      <Head>
        <title>I love Qiita</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ backgroundColor: '#F1EAFA' }}>
        <h1>I love Qiita</h1>
        <div>
          <form>
            <MainTextBox />
            <div></div>
            <div>
              <Button
                variant="primary"
                onClick={handleTitleClick}
                label={'Search'}
                disabled={
                  !articleTitle.length ||
                  !qiitaApiToken.length ||
                  !isValidApiToken
                }
              />
            </div>
          </form>
        </div>
        {/* <div>
          <form action="">
            TODO: APIキーの入力部分は最終的にはモーダルで実装したい
            TODO:　正規表現を用いてAPIキーの形式をチェックする
            <input
              onChange={handleInputApi}
              type="text"
              placeholder="APIキー"
            />
            {isValidApiToken ? null : (
              <div style={{ color: 'red' }}>APIキーの形式が無効です</div>
            )}
            <div>{qiitaApiToken}</div>
          </form>
        </div> */}
        <div>
          {isSearching ? (
            <div>Searching ...</div>
          ) : (
            articles.map((article) => (
              <div key={article.id}>
                <Link href={article.id}>{article.title}</Link>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  )
}
