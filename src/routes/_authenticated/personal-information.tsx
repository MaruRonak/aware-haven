import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute(
  "/_authenticated/personal-information"
)({
  component: PersonalInformation,
});

function PersonalInformation() {
const [profileImage, setProfileImage] =
  useState<string | null>(
    localStorage.getItem("profileImage")
  );

  const [form, setForm] = useState({
    fullName: "Jay Solanki",
    phone: "+91 9876543210",
    dob: "",
    gender: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  const handleImage = (e: any) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const imageUrl =
    URL.createObjectURL(file);

  setProfileImage(imageUrl);

  localStorage.setItem(
    "profileImage",
    imageUrl
  );
};

const saveInformation = () => {
  console.log(form);

  toast.success("Information Saved Successfully");
};

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/profile"
          className="grid h-11 w-11 place-items-center rounded-xl border"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="text-3xl font-bold">
          Personal Information
        </h1>
      </div>

      <div className="rounded-3xl border bg-card p-8 shadow-sm">

        {/* Profile Photo */}
        <div className="mb-8 flex flex-col items-center">
          <label htmlFor="profileImage">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-primary cursor-pointer">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-violet-100 text-5xl">
                  👤
                </div>
              )}
            </div>
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />

          <p className="mt-3 text-sm text-muted-foreground">
            Click photo to upload profile image
          </p>
        </div>

        {/* Personal Details */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="font-medium">
              Full Name
            </label>

            <Input
              className="mt-2"
              value={form.fullName}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Phone Number
            </label>

            <Input
              className="mt-2"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Date of Birth
            </label>

            <Input
              type="date"
              className="mt-2"
              value={form.dob}
              onChange={(e) =>
                setForm({
                  ...form,
                  dob: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Gender
            </label>

            <select
              className="mt-2 w-full rounded-xl border p-3"
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value,
                })
              }
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

        </div>

        {/* Address */}
        <div className="mt-5">
          <label className="font-medium">
            Address
          </label>

          <textarea
            rows={4}
            className="mt-2 w-full rounded-xl border p-3"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />
        </div>

        {/* Emergency Contact */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-primary">
            Emergency Contact
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="font-medium">
                Contact Name
              </label>

              <Input
                className="mt-2"
                value={form.emergencyName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    emergencyName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="font-medium">
                Contact Number
              </label>

              <Input
                className="mt-2"
                value={form.emergencyPhone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    emergencyPhone: e.target.value,
                  })
                }
              />
            </div>

          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={saveInformation}
          className="mt-8 h-12 w-full rounded-2xl text-base font-semibold"
        >
          Save Information
        </Button>

      </div>
    </div>
  );
}