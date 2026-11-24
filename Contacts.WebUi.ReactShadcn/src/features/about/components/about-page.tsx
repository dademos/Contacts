export function AboutPage() {
  return (
    <article className="typeset">
      <h1>Welcome to Contacts Demo app</h1>

      <p>
        This is a small demo app created with React shadcn/ui and .Net Web API.
        It demonstrates CRUD functionality along with list paging, sorting and
        filtering.
      </p>

      <p>
        Please see README in the{' '}
        <a
          href="https://github.com/dademos/Contacts"
          target="_blank"
          rel="noopener"
          //className="link"
        >
          source code repository
        </a>{' '}
        for details.
      </p>

      <p>
        There's also{' '}
        <a
          href="https://contactsdemo-fab2esdtdjcvgyad.australiaeast-01.azurewebsites.net/"
          target="_blank"
          rel="noopener"
          className="link"
        >
          Angular Material
        </a>{' '}
        frontend for the same backend.
      </p>

      <p>
        Note: all API endpoints have artificial half a second delay for the sake
        of demoing the frontend's loading states. Plus the first time you go to
        the Contacts route it may take a few seconds to load as Azure App
        Service spins up the API.
      </p>
    </article>
  );
}
