import React, { useRef, useState } from "react";
import { FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import useJobPositions from "../hooks/useJobPositions";
import { JobPosition } from "../types/common";
import { Button, ConfirmDialog, EmptyState, ErrorState, Field, Loading, Notice, Panel, useAdminTitle } from "./ui";
import { shortDate } from "./format";

/** Open job positions (shown on the public jobs page): list, add, delete. */

type Draft = { departure: string; destination: string; distance: string; type: string };
const EMPTY: Draft = { departure: "", destination: "", distance: "", type: "" };

const PositionsSection: React.FC = () => {
  const { jobPositions, loading, error, addJobPosition, deleteJobPosition, reload } = useJobPositions();
  useAdminTitle("Job positions");

  const [flash, setFlash] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<JobPosition | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const busy = useRef(false);

  const change = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((d) => ({ ...d, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy.current) return;
    const errs: Partial<Record<keyof Draft, string>> = {};
    if (!draft.departure.trim()) errs.departure = "Enter the departure.";
    if (!draft.destination.trim()) errs.destination = "Enter the destination.";
    if (!draft.distance) errs.distance = "Enter the distance in km.";
    else if (!(Number(draft.distance) > 0)) errs.distance = "Enter a distance greater than 0.";
    if (!draft.type.trim()) errs.type = "Enter the type of service.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`ad-pos-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    busy.current = true;
    setSaving(true);
    setSaveError(null);
    // Same body as before: the empty id and date are filled in by the API.
    const ok = await addJobPosition({ positionId: "", createdAt: "", ...draft, distance: Number(draft.distance) });
    busy.current = false;
    setSaving(false);
    if (ok) {
      setAdding(false);
      setFlash(`Position ${draft.departure} → ${draft.destination} added.`);
      setDraft(EMPTY);
    } else {
      setSaveError("The position could not be saved. Your input is still here – try again.");
    }
  };

  const doDelete = async () => {
    if (!toDelete || busy.current) return;
    busy.current = true;
    setDeleting(true);
    setDeleteError(null);
    const ok = await deleteJobPosition(toDelete.positionId, toDelete.createdAt);
    busy.current = false;
    setDeleting(false);
    if (ok) {
      setFlash(`Position ${toDelete.departure} → ${toDelete.destination} deleted.`);
      setToDelete(null);
    } else {
      setDeleteError("The position could not be deleted. Nothing was changed – try again.");
    }
  };

  const openAdd = () => {
    setSaveError(null);
    setAdding(true);
  };

  const first = loading && !jobPositions.length;

  return (
    <section className="ad-section" aria-labelledby="ad-h1">
      <header className="ad-section__head">
        <h1 id="ad-h1" tabIndex={-1}>
          Job positions
        </h1>
        <div className="ad-section__actions">
          <Button icon={<FiRefreshCw />} onClick={() => reload()} busy={loading && !first} disabled={first}>
            Refresh
          </Button>
          <Button variant="primary" icon={<FiPlus />} onClick={openAdd}>
            Add position
          </Button>
        </div>
      </header>
      <p className="ad-lead">Positions listed here are shown on the public jobs page.</p>

      {flash && (
        <Notice tone="success" onClose={() => setFlash(null)}>
          {flash}
        </Notice>
      )}

      {first ? (
        <Loading label="Loading positions…" />
      ) : error && !jobPositions.length ? (
        <ErrorState title="The positions could not be loaded." detail="Check the connection and try again." onRetry={() => reload()} />
      ) : !jobPositions.length ? (
        <EmptyState
          title="No open positions."
          text="Add a position to show it on the jobs page."
          action={
            <Button variant="primary" icon={<FiPlus />} onClick={openAdd}>
              Add position
            </Button>
          }
        />
      ) : (
        <>
          {error && <Notice tone="error">The list could not be refreshed. You are seeing the positions loaded earlier.</Notice>}
          <div className="ad-table-wrap ad-table-wrap--always">
            <table className="ad-table ad-table--plain">
              <caption className="ad-sr">Open job positions</caption>
              <thead>
                <tr>
                  <th scope="col">Route</th>
                  <th scope="col">Distance</th>
                  <th scope="col">Service</th>
                  <th scope="col">Added</th>
                  <th scope="col">
                    <span className="ad-sr">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobPositions.map((p, i) => (
                  <tr key={p.positionId || i}>
                    <td data-label="Route">
                      <strong>{p.departure || "–"}</strong> → <strong>{p.destination || "–"}</strong>
                    </td>
                    <td data-label="Distance">{p.distance ? `${p.distance} km` : "–"}</td>
                    <td data-label="Service">{p.type || "–"}</td>
                    <td data-label="Added">{p.createdAt ? <time dateTime={p.createdAt}>{shortDate(p.createdAt)}</time> : "–"}</td>
                    <td className="ad-table__actions">
                      <Button
                        size="sm"
                        variant="danger"
                        icon={<FiTrash2 />}
                        onClick={() => {
                          setDeleteError(null);
                          setToDelete(p);
                        }}
                        aria-label={`Delete position ${p.departure} to ${p.destination}`}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Panel
        open={adding}
        onClose={() => !saving && setAdding(false)}
        title="Add position"
        actions={
          <>
            <Button onClick={() => setAdding(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="ad-pos-form" busy={saving}>
              Add position
            </Button>
          </>
        }
      >
        <form id="ad-pos-form" className="ad-form" onSubmit={save} noValidate>
          <Field id="ad-pos-departure" label="Departure" value={draft.departure} onChange={change("departure")} error={errors.departure} autoComplete="off" />
          <Field id="ad-pos-destination" label="Destination" value={draft.destination} onChange={change("destination")} error={errors.destination} autoComplete="off" />
          <Field id="ad-pos-distance" label="Distance (km)" type="number" inputMode="numeric" min={1} value={draft.distance} onChange={change("distance")} error={errors.distance} />
          <Field id="ad-pos-type" label="Type of service" value={draft.type} onChange={change("type")} error={errors.type} autoComplete="off" />
          {saveError && <Notice tone="error">{saveError}</Notice>}
        </form>
      </Panel>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this position?"
        text={
          <p>
            <strong>
              {toDelete?.departure} → {toDelete?.destination}
            </strong>{" "}
            will be removed from the jobs page. This cannot be undone.
          </p>
        }
        confirmLabel="Delete position"
        busy={deleting}
        error={deleteError}
        onConfirm={doDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
};

export default PositionsSection;
