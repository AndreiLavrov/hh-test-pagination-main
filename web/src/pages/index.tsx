import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Link from 'next/link';
import { Alert, Container, Pagination, Table } from 'react-bootstrap';

const inter = Inter({ subsets: ['latin'] });

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  totalCount?: number
  page?: number
}

const pageSize = 20; // I would move it to data folder
const pageButtonsAvailable = 10; // I would move it to data folder

// I would move to 'api' folder
const fetchData = async (page: number = 1) => {
  try {
    const res = await fetch(`http://localhost:3000/users?page=${page}&limit=${pageSize}`, { method: 'GET' });
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [] } };
    }

    const { users, totalCount } = await res.json();

    return {
      props: { statusCode: 200, users, totalCount, page },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { props: { statusCode: 500, users: [] } };
  }
};

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  let { page = 1 } = ctx.query;
  const { props } = await fetchData(+page);

  return {
    props,
  };
}) satisfies GetServerSideProps<TGetServerSideProps>;


export default function Home({ statusCode, users, totalCount = 0, page: currentPage = 1 }: TGetServerSideProps) {
  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const renderPaginationItems = () => {
    const items = [];
    const maxPages = Math.ceil(totalCount / pageSize);
    const startPage = Math.max(1, currentPage - Math.floor(pageButtonsAvailable / 2));
    const endPage = Math.min(maxPages, startPage + pageButtonsAvailable - 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Link href={`/?page=${i}`}>
          <Pagination.Item
            key={i}
            active={i === currentPage}
            as="span"
          >
            {i}
          </Pagination.Item>
        </Link>,
      );
    }

    return items;
  };

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Link href={`/?page=${1}`}>
              <Pagination.First as="span"/>
            </Link>
            {currentPage === 1 ? (
              <Pagination.Prev
                disabled={currentPage === 1}
                as="span"
              />
            ) : (
              <Link href={`/?page=${+currentPage - 1}`}>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  as="span"
                />
              </Link>
            )}
            {renderPaginationItems()}
            {currentPage === (totalCount / pageSize) ? (
              <Pagination.Next
                disabled={currentPage === (totalCount / pageSize)}
                as="span"
              />
            ) : (
              <Link href={`/?page=${+currentPage + 1}`}>
                <Pagination.Next
                  as="span"
                />
              </Link>
            )}
            <Link href={`/?page=${totalCount / pageSize}`}>
              <Pagination.Last as="span"/>
            </Link>
          </Pagination>
        </Container>
      </main>
    </>
  );
}
