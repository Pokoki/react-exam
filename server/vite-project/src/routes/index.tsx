import { createFileRoute,Link } from '@tanstack/react-router';
import { Compagny, getCompagnies } from '../WebServices/API/companies'; // Adjust the import path if necessary

const Compagnies = () => {
  const compagnies = Route.useLoaderData() as Compagny[];
  return (
    <div>
      <h1>Companies List</h1>
      {compagnies ? (
        <ul>
          {compagnies.map((company) => (
            <li key={company.id}>
              <div>
                <Link to={`/c/${company.id}`}>{company.name}</Link>
              </div>
              <p>
                {company.domains.map((domain, index) => (
                  <span key={index} style={{ padding: '2px', fontSize: 'smaller' }}>
                    {domain}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Compagnies,
  loader: async () => await getCompagnies(),
});
