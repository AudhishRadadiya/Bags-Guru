import { memo, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { useSelector } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const severityMap = {
  high: { label: 'High', severity: 'danger' },
  medium: { label: 'Medium', severity: 'warning' },
  low: { label: 'Low', severity: 'info' },
};

const getSeverityConfig = severity => {
  const key = severity?.toLowerCase();
  return severityMap[key] || { label: severity || '—', severity: 'secondary' };
};

const SummaryCard = ({ label, count, className }) => (
  <div className={`comparison_summary_card ${className}`}>
    <span className="comparison_summary_count">{count ?? 0}</span>
    <span className="comparison_summary_label">{label}</span>
  </div>
);

const ComparisonResultSection = () => {
  const { aiDesignComparisonResult } = useSelector(({ product }) => product);

  const issues = aiDesignComparisonResult?.issues || [];

  const issuesCount = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };

    for (const issue of aiDesignComparisonResult?.issues || []) {
      const severity = issue?.severity?.toLowerCase();

      if (severity) {
        counts[severity] = counts[severity] + 1;
      }
    }

    return counts;
  }, [aiDesignComparisonResult?.issues]);

  if (!aiDesignComparisonResult) {
    return (
      <div className="comparison_result_section comparison_result_ready">
        <div className="comparison_result_ready_content">
          <h5>Ready</h5>
          <p>
            Click &quot;Compare with AI&quot; to analyze the main design against
            selected references.
          </p>
        </div>
      </div>
    );
  }

  const wrapCellBody = value => {
    return <div className="comparison_cell_text">{value || ''}</div>;
  };

  const severityBody = row => {
    const config = getSeverityConfig(row?.severity);
    return <Tag value={config.label} severity={config.severity} />;
  };

  return (
    <div className="comparison_result_section comparison_result_done">
      <div className="comparison_result_header">
        <h5>Comparison Result</h5>
      </div>

      <div className="comparison_summary_row">
        <SummaryCard
          label="High Issues"
          count={issuesCount.high}
          className="high"
        />
        <SummaryCard
          label="Medium Issues"
          count={issuesCount.medium}
          className="medium"
        />
        <SummaryCard
          label="Low Issues"
          count={issuesCount.low}
          className="low"
        />
        <SummaryCard
          label="Total Issues"
          count={issues.length}
          className="total"
        />
      </div>

      {issues?.length > 0 ? (
        <div className="data_table_wrapper with_colspan_head cell_padding_large comparison_issues_table">
          <DataTable
            value={issues}
            tableStyle={{ tableLayout: 'fixed', width: '100%' }}
          >
            <Column
              field="category"
              header="Category"
              headerStyle={{ width: '12%' }}
              body={row => wrapCellBody(row?.category)}
            />
            <Column
              field="title"
              header="Title"
              headerStyle={{ width: '18%' }}
              body={row => wrapCellBody(row?.title)}
            />
            <Column
              field="severity"
              header="Severity"
              body={severityBody}
              headerStyle={{ width: '130px' }}
              bodyStyle={{ width: '130px' }}
            />
            <Column
              field="found"
              header="Found"
              body={row => wrapCellBody(row?.found)}
            />
            <Column
              field="expected"
              header="Expected"
              body={row => wrapCellBody(row?.expected)}
            />
            <Column
              field="description"
              header="Description"
              body={row => wrapCellBody(row?.description)}
            />
          </DataTable>
        </div>
      ) : (
        <div className="comparison_no_issues">
          <p>No issues found. Design matches selected references.</p>
        </div>
      )}
    </div>
  );
};

export default memo(ComparisonResultSection);
